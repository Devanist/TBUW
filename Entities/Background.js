define(['Entities/Item'], function(Item){
    
    var Background = function(sprite){
        Item.call(this, sprite);
        this._data.type = "background";
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