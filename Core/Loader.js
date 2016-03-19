///https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/decodeAudioData
define([
    '../Assets/assets.json',
    '../Entities/Entities'
    ], function(cfg, Entities){

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
        
        /**
         * Metoda dodaje elementy do sceny na podstawie configu.
         */
        loadStageConfig : function(stage, cfg){
            
            var l = cfg.length;
            var e = null;
            var temp = null;
            
            for(var i = 0; i < l; i++){
                e = cfg[i];
                if(e.type === "background"){
                    temp = new Entities.Background(this._resources[e.texture].texture);
                }
                else if(e.type === "platform"){
                    temp = new Entities.Platform(this._resources[e.texture].texture);
                }
                else if(e.type === "player"){
                    temp = new Entities.Player(this._resources[e.texture].texture);
                }
                temp.setPosition(e.position);
                temp.setScale({x: 0.7, y: 0.7});
                stage.add(temp);
                
            }
            
        },
        
        setResources : function(res){
            this._resources = res;
        }

    };

    return Loader;
});