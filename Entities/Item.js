define(['Entities/Entity'], function(Entity){
    
    var Item = function(id, sprite) {
        Entity.call(this, id, sprite);
        this._data.type = "Item";
        this._data.inheritedTypes.push(this._data.type);
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