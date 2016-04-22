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
        this._allAssets = this._cfg.graphics.length;
        this._resources = null;
    };

    Loader.prototype = {

        /**
         * Method loading all assets given in config. When they all are loaded it triggers given callback function.
         * @param {function} callback Callback method
         */
        loadAssets : function(callback){
            var t = null;
            
            for(var i = 0; i < this._allAssets; i++){
                t = this._cfg.graphics[i];
                PIXI.loader.add(t.name, t.path);
            }
            
            PIXI.loader.once('complete', callback);
            
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
                    temp = new Entities.Background(PIXI.loader.resources[e.texture].texture, e.factor);
                }
                else if(e.type === "platform"){
                    temp = new Entities.Platform(PIXI.loader.resources[e.texture].texture);
                }
                else if(e.type === "player"){
                    temp = new Entities.Player(e.id, PIXI.loader.resources[e.texture].texture);
                }
                else if(e.type === "BlockCoin"){
                    temp = new Entities.BlockCoin(e.quantity);
                }
                console.log(e);
                temp.setPosition(e.position);
                stage.add(temp);

                if (isDebug) {
                    temp.debug_addBoundaryBox(new BoundaryBox(temp.getPosition(), temp.getSize()));
                }
                
            }
            
        }

    };

    return Loader;
});