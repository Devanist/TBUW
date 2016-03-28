define(['Entities/Entity'], function(Entity){
    
    var Creature = function(id, sprite){
        Entity.call(this, sprite);
        this._isStatic = false;
        this._data.velocity = {
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
    
    _p.update = function (){
        this._sprite.position.x = this._data.position.x;
        this._sprite.position.y = this._data.position.y;
    };
    
    _p.getVelocity = function () {
        return this._velocity;
    };
    
    return Creature;
    
});