define(['Entities/Entity'], function(Entity){
    
    var Creature = function(id, sprite){
        Entity.call(this, sprite);
        this._isStatic = false;
        this._velocity = {
            x: 0,
            y: 0
        };
        this._id = id;
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
    
    return Creature;
    
});