define(['Entities/Item'], function(Item){
    
    var Background = function(sprite){
        Item.call(this, sprite);
        this._data.type = "background";
        this._data.movingSpeedFactor = 0.5;
    };
    
    Background.prototype = Object.create(Item.prototype, {
        constructor: {
            value: Background,
            writable: true,
            configurable: true,
            enumerable: false
        }
    });
    
    return Background;
    
});