define(['Entities/Item'], function(Item){
    
    var Platform = function(sprite){
        Item.call(this, sprite);
        this._isStatic = true;
        this._data.type = "platform";
        this._data.movingSpeedFactor = 0.75;
    };

    Platform.prototype = Object.create(Item.prototype, {
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