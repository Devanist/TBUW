define(['Entities/Entity'], function(Entity){
    
    var Creature = function(id, sprite){
        Entity.call(this, id, sprite);
        this._isStatic = false;
        this._data.velocity = {
            x: 0,
            y: 0
        };
    };
    
    Creature.prototype = Object.create(Entity.prototype, {
        constructor: {
            value: Creature,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    
    var _p = Creature.prototype;
    
    _p.getId = function () { 
        return this._id;
    };
    
    _p.getVelocity = function () {
        return this._velocity;
    };
    
    return Creature;
    
});