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
    _p.updateVelocity = function(val){
        this._velocity.x += val.x;
        this._velocity.y += val.y;
    };
    
    _p.updatePosition = function(){
        this._sprite.position.x += this._velocity.x;
        this._sprite.position.y += this._velocity.y;
    };
    
    _p.getVelocityX = function () {
        return this._velocity.x;
    };
    
    _p.getVelocityY = function () {
        return this._velocity.y;
    };
    
    return Creature;
    
});