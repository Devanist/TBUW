///https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/decodeAudioData
define([
    'json!Assets/assets.json',
    'Entities/Entities',
    'Debug/BoundaryBox',
    'GUI/GUI'
    ], function(cfg, Entities, BoundaryBox, GUI){

    /**
     * Wrapper for PIXI.loader
     */
    var Loader = function () {
        this._cfg = cfg;
        this._progressCb = null;
        this._loadedAssets = 0;
        this._areSoundsLoaded = false;
        this._allAssets = this._cfg.graphics.length + this._cfg.sounds.length;
    };

    Loader.prototype = {

        /**
         * Method loading all assets given in config. When they all are loaded it triggers given callback function.
         * @param {function} callback Callback method
         */
        loadAssets : function(callback, speaker){
            var t = null;
            var that = this;
            
            for(var i = 0; i < this._allAssets; i++){
                t = this._cfg.graphics[i];
                PIXI.loader.add(t.name, t.path);
            }
            
            this.loadSounds(cfg.sounds, speaker);
            
            PIXI.loader.once('complete', function cb(){
                if(that._areSoundsLoaded){
                    callback();
                }
                else{
                    setTimeout(function(){
                        cb();
                    }.bind(this), 100);
                }
            });
            
            if(this._progressCb !== null){
                PIXI.loader.on('progress', this._progressCb);
            }
            
            PIXI.loader.load();
        },
        
        /**
         * Sets the onprogress callback function.
         * @param {function} cb Callback method
         */
        setProgressCb : function(cb){
            this._progressCb = cb;
        },
        
        /**
         * Method returns the quantity of already loaded assets.
         * @returns {int}
         */
        assetsLoaded : function(){
            return this._loadedAssets;
        },
        
        /**
         * Method returns the quantity of all assets that should be loaded.
         * @returns {int}
         */
        allAssets : function(){
            return this._allAssets;
        },
        
        /**
         * Method increment the loaded assets counter.
         */
        incrementLoadedAssets : function(){
            this._loadedAssets += 1;
        },
        
        loadSounds : function(cfg, speaker){
            var request = null;
            var that = this;
            var ls = 0;
            if(cfg.length === 0){
                that._areSoundsLoaded = true;
                console.log('Sounds are loaded');
                return;
            }
            for(var i = 0; i < cfg.length; i+=1){
                request = new XMLHttpRequest();
                request.open("GET", cfg[i].url, true);
                request.responseType = "arraybuffer";
                
                request.onload = function(){
                    ls += 1;
                    console.log(this);
                    speaker.addSoundToLibrary(request.response);
                    that.incrementLoadedAssets();
                    if(ls === cfg.length){
                        console.log('Sounds are loaded');
                        that._areSoundsLoaded = true;
                    }
                };
            }
        },
        
        /**
         * Method creates the elements from given config and injects them into given stage.
         * @param {object} stage Stage that you want inject elements into
         * @param {object} cfg Config file
         * @param {boolean} debug If this is true, boundary boxes will be showed
         */
        loadStageConfig : function(stage, cfg, debug){
            
            var l = cfg.length;
            var e = null;
            var temp = null;
            var isDebug = debug || false;
            
            for(var i = 0; i < l; i++){
                e = cfg[i];
                if(e.type === "background"){
                    temp = new Entities.Background(e.id, PIXI.loader.resources[e.texture].texture, e.factor);
                }
                else if(e.type === "platform"){
                    temp = new Entities.Platform(e.id, PIXI.loader.resources[e.texture].texture);
                }
                else if(e.type === "player"){
                    temp = new Entities.Player(e.id, PIXI.loader.resources[e.texture].texture);
                }
                else if(e.type === "BlockCoin"){
                    temp = new Entities.BlockCoin(e.id, e.quantity);
                }
                console.log(e);
                temp.setPosition(e.position);
                stage.add(temp);

                if (isDebug) {
                    if(temp._data.anchor === undefined || temp._data.anchor === null){
                        temp.debug_addBoundaryBox(new BoundaryBox(temp.getPosition(), temp.getSize()));
                    }
                    else{
                        var pos = temp.getPosition();
                        var size = temp.getSize();
                        pos.x = pos.x - size.w * temp._data.anchor.x;
                        pos.y = pos.y - size.h * temp._data.anchor.y;
                        temp.debug_addBoundaryBox(new BoundaryBox(pos, size, temp._data.anchor));
                    }
                }
                
            }
            
        }

    };

    return Loader;
});