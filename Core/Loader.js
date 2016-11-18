///https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/decodeAudioData
define([
    'json!Assets/assets.json',
    'Entities/Entities',
    'Debug/BoundaryBox',
    'Core/Stage',
    'GUI/GUI'
    ], function(cfg, Entities, BoundaryBox, Stage, GUI){

    /**
     * @class
     * @memberOf Core
     * @extends PIXI.loader
     * Wrapper for PIXI.loader
     */
    var Loader = function () {
        this._cfg = cfg;
        this._preloaded = false;
        this._progressCb = null;
        this._loadedAssets = 0;
        this._areSoundsLoaded = false;
        this._graphicAssets = 0;
        this._audioAssets = this._cfg.sounds.length;
    };

    Loader.prototype = {
        
        preload : function(){
            var that = this;
            PIXI.loader.add(this._cfg.preload.name, this._cfg.preload.path);
            PIXI.loader.once('complete', function(){
                that._preloaded = true;
            });
            PIXI.loader.load();
        },

        /**
         * Method loading all assets given in config. When they all are loaded it triggers given callback function.
         * @param {function} callback Callback method
         */
        loadAssets : function(callback, speaker, rootStage){
            var that = this;
            
            if(this._preloaded){
                //Show loading screen
                var con = new Stage();
                var ls = new GUI.Image("loadingScreen", "center", PIXI.Texture.fromFrame("loading_off"));
                con.add(ls);
                var progressbar = new GUI.Image("progressbar", {x: ls._sprite.position.x + 44, y: ls._sprite.position.y + 108}, PIXI.Texture.fromFrame("loading_progressbar"));
                con.add(progressbar);
                var blurFilter = new PIXI.filters.BlurFilter();
                progressbar._sprite.filters = [blurFilter];
                rootStage.add(con);
                
                //Load assets
                var t = null;
                
                for(var i = 0; i < this._cfg.graphics.length; i++){
                    t = this._cfg.graphics[i];
                    if(window.innerWidth <= 640){
                        if(t.name.substr(t.name.length - 5) === "small"){
                            this._graphicAssets += 1;
                            PIXI.loader.add(t.name, t.path);
                        }
                    }
                    else{
                        if(t.name.substr(t.name.length - 5) !== "small"){
                            this._graphicAssets += 1;
                            PIXI.loader.add(t.name, t.path);
                        }
                    }
                    this._allAssets = this._graphicAssets*2 + this._cfg.sounds.length;
                }
                
                for(i = 0; i < this._cfg.fonts.length; i+=1){
                    t = this._cfg.fonts[i];
                    this._graphicAssets += 1;
                    PIXI.loader.add(t.name, t.path);
                }

                this.loadSounds(cfg.sounds, speaker);
                
                PIXI.loader.once('complete', function cb(){
                    if(that._areSoundsLoaded){
                        rootStage.remove("loadingScreen");
                        rootStage.remove("progressbar");
                        rootStage.getStage().removeChild(con.getStage());
                        con.getStage().destroy();
                        callback();
                    }
                    else{
                        setTimeout(function(){
                            cb();
                        }.bind(this), 100);
                    }
                });
                
                if(this._progressCb !== null){
                    PIXI.loader.on('progress', function(){
                        progressbar._sprite.filters[0].blur = 20 * Math.sin(that._loadedAssets);
                        progressbar._sprite.width = 517 / that._allAssets * that._loadedAssets | 0;
                        that._progressCb();
                    });
                }
                
                PIXI.loader.load();
            }
            else{
                setTimeout(function(){
                    that.loadAssets(callback, speaker, rootStage);
                }, 100);
            }
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
        
        loadCinematicConfig : function(cfg, cinCfg, stage, cinematic){
            var i;
            var temp;
            for(i = 0; i < cfg.frames.length; i+=1){
                temp = new GUI.Image(cfg.frames[i], {x: 0, y: 2000}, PIXI.Texture.fromFrame(cfg.frames[i]));
                stage.add(temp);
            }
            
            for(i = 0; i < cfg.animations.length; i+=1){
                cinCfg.push(cfg.animations[i]);
            }
            
            var music = null;
            if(cfg.music_offset !== undefined){
                music = {
                    name: cfg.music, 
                    offset: cfg.music_offset
                };
            }
            else{
                music = cfg.music;
            }
            cinematic.setMusic(music);
            cinematic.hasLoaded();
            
        },
        
        loadSounds : function(cfg, speaker){
            var request = null;
            var that = this;
            var ls = 0;
            var sp = speaker;
            
            var soundOnLoad = function(){
                ls += 1;
                sp.addSoundToLibrary(this.response, this.assetName);
                that._progressCb();
                if(ls === cfg.length){
                    console.log('Sounds are loaded');
                    that._areSoundsLoaded = true;
                }
            };
            
            if(cfg.length === 0){
                that._areSoundsLoaded = true;
                console.log('Sounds are loaded');
                return;
            }
            for(var i = 0; i < cfg.length; i+=1){
                request = new XMLHttpRequest();
                request.open("GET", cfg[i].path, true);
                request.responseType = "arraybuffer";
                request.assetName = cfg[i].name;
                request.onload = soundOnLoad;
                
                request.send();
            }
        },
        
        loadWinConditions : function(array, cfg){
            for(var i = 0; i < cfg.length; i++){
                array.push(cfg[i]);
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
                if(e.type === "Background"){
                    temp = new Entities.Background(e.id, PIXI.Texture.fromFrame(e.texture), e.factor);
                }
                else if(e.type === "Platform"){
                    temp = new Entities.Platform(e.id, PIXI.Texture.fromFrame(e.texture));
                }
                else if(e.type === "Player"){
                    var frames = [];
                    for(var j = 0; j < 5; j+=1){
                        frames.push(PIXI.Texture.fromFrame('walrus_0000' + j));
                    }
                    temp = new Entities.Player(e.id, frames);
                }
                else if(e.type === "BlockCoin"){
                    temp = new Entities.BlockCoin(e.id, e.quantity);
                }
                else if(e.type === "PositionField"){
                    temp = new Entities.PositionField(e.id);
                }
                else if(e.type === "MovingPlatform"){
                    temp = new Entities.MovingPlatform(e.id, PIXI.Texture.fromFrame(e.texture), e.startPos, e.endPos, e.time);
                }
                else if(e.type === "LasersFromGround"){
                    temp = new Entities.LasersFromGround(e.id);
                }
                var small = 1;
                if(window.innerWidth <= 640){
                    small = 2;
                }
                if(e.rotation !== undefined && e.rotation !== null){
                    temp.setRotationAngle(e.rotation);
                }
                if(e.anchor !== undefined && e.anchor !== null){
                    temp.setAnchor(e.anchor);
                }
                temp.setPosition({x: e.position.x / small, y: e.position.y / small});
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
            
        },

        loadGUILayer : function(GUI_stage, Background_stage, cfg){

            cfg.Background.children.map(configToElements).
                forEach( (el) => {
                    Background_stage.add(el);
                });

            cfg.GUI.children.map(configToElements)
                .forEach( (el) => {
                    GUI_stage.add(el);
                });

            function configToElements( obj ){

                let temp;

                let small = 1;
                if(window.innerWidth <= 640){
                    small = 2;
                }

                if(obj.options && obj.options.fontSize && obj.options.fontFamily){
                    obj.options.font = `${parseInt(obj.options.fontSize) / small}px ${obj.options.fontFamily}`;
                }

                let texture = null;
                if(obj.texture !== null && obj.texture !== undefined){
                    texture = PIXI.Texture.fromFrame(obj.texture);
                }

                switch(obj.type){
                    case "image":
                        temp = new GUI.Image(obj.id, obj.position, texture);
                        break;
                    case "label":
                        temp = new GUI.Label(obj.id, obj.position, obj.text, obj.options);
                        break;
                    case "button":
                        temp = new GUI.Button(obj.id, obj.position, texture, obj.text, obj.options);
                        break;
                    default: 
                        console.error(`Bad type: ${obj.type}`);
                        break;
                }

                if(obj.move){
                    temp.move(obj.move);
                }
                if(obj.visible !== undefined && obj.visible !== null){
                    temp.display(obj.visible);
                }
                return temp;

            }

        }

    };

    return Loader;
});