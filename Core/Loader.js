///https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/decodeAudioData
define(['../Assets/assets.json'], function(cfg){
    
    var Loader = function () {
        this._cfg = cfg;
    };

    Loader.prototype = {

        loadAssets : function(callback){
            var allAssets = this._cfg.graphics.length;
            var loadedAssets = 0;
            var t = null;
            
            for(var i = 0; i < allAssets; i++){
                t = this._cfg.graphics[i];
                PIXI.loader.add(t.name, t.path);
            }
            
            PIXI.loader.once('complete', callback);
            
            PIXI.loader.load();
        }

    };

    return Loader;
});