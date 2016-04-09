///https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/decodeAudioData
define([
    'json!Assets/assets.json',
    'Entities/Entities',
    'Debug/BoundaryBox',
    'GUI/GUI'
    ], function(cfg, Entities, BoundaryBox, GUI){

    var Loader = function () {
        this._cfg = cfg;
        this._progressCb = null;
        this._loadedAssets = 0;
        this._allAssets = this._cfg.graphics.length;
        this._resources = null;
    };

    Loader.prototype = {

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
        
        setProgressCb : function(cb){
            this._progressCb = cb;
        },
        
        assetsLoaded : function(){
            return this._loadedAssets;
        },
        
        allAssets : function(){
            return this._allAssets;
        },
        
        incrementLoadedAssets : function(){
            this._loadedAssets += 1;
        },
        
        setResources : function(res){
            this._resources = res;
            
            for(var gui in GUI){
                if(GUI.hasOwnProperty(gui)){
                    if(gui === "Button"){
                        GUI[gui]._spriteSource = this._resources["GUI_Button"].texture;
                    }
                }
            }
        },
        
        /**
         * Metoda dodaje elementy do sceny na podstawie configu.
         */
        loadStageConfig : function(stage, cfg, debug){
            
            var l = cfg.length;
            var e = null;
            var temp = null;
            var isDebug = debug || false;
            
            for(var i = 0; i < l; i++){
                e = cfg[i];
                if(e.type === "background"){
                    temp = new Entities.Background(this._resources[e.texture].texture, e.factor);
                }
                else if(e.type === "platform"){
                    temp = new Entities.Platform(this._resources[e.texture].texture);
                }
                else if(e.type === "player"){
                    temp = new Entities.Player(e.id, this._resources[e.texture].texture);
                }
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