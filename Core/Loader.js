///https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/decodeAudioData
define(['../Assets/assets.json'], function(cfg){
    
    var Loader = function () {
        this._cfg = cfg;
        this._progressCb = null;
        this._loadedAssets = 0;
        this._allAssets = this._cfg.graphics.length;
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
        }

    };

    return Loader;
});