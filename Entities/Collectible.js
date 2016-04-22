define(['Entities/Entity'], function(Entity){
    
    var Collectible = function(sprite, position){
        Entity.call(this, sprite);
        this.setPosition(position);
        this._currency = null;
    };
    
    Collectible.prototype = Object.create(Entity.prototype,{
        constructor: {
            value: Collectible,
            enumerable: false,
            configurable: true,
            writable: true
        }
    });
    
    var _p = Collectible.prototype;
    
    _p.collect = function(){
        var q = this._currency.getQuantity();
        this._currency.setQuantity(0);
        return q;
    };
    
    return Collectible;
    
});