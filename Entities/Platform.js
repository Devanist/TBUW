define(['./Entity'], function(Entity){
    
    var Platform = function(sprite){
        Entity.call(this, sprite);
        this._isStatic = true;
        this._speedVector.y = 0;
    };

    Platform.prototype = Object.create(Entity.prototype, {
        constructor: {
            value: Platform,
            writable: true,
            enumerable: false,
            configurable: true
        }
    });

    var _p = Platform.prototype;

    return Platform;
    
});