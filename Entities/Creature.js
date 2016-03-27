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
    
    _p.update = function (o){
        this._velocity = o.velocity;
        this._sprite.position.x = o.position.x;
        this._sprite.position.y = o.position.y;
    };
    
    _p.getVelocity = function () {
        return this._velocity;
    };
    
    return Creature;
    
});