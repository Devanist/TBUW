define(['Entities/Entity'], function(Entity){
    
    var Item = function(sprite) {
        Entity.call(this, sprite);
        this._isStatic = true;
    };
    
    Item.prototype = Object.create(Entity.prototype, {
        constructor:{
            value: Item,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    
    return Item;
    
});