define(['Entities/Item'], function(Item){
    
    var Platform = function(id, sprite){
        Item.call(this, id, sprite);
        this._isStatic = true;
        this._data.type = "platform";
        this._data.movingSpeedFactor = 1;
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