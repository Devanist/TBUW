//made it as worker
///https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/decodeAudioData

var Loader = function (cfg) {
    this._cfg = {
        "graphics": [
            {
                "name": "bunny",
                "path": "ludzik.png"
            },
            {
                "name": "platform",
                "path": "platform.jpg"
            }
        ],
        "sounds": [
            
        ]
    };
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