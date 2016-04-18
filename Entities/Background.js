define(['Entities/Item'], function(Item){
    
    var Background = function(id, sprite, factor){
        Item.call(this, id, sprite);
        this._data.type = "background";
        this._data.movingSpeedFactor = factor;
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