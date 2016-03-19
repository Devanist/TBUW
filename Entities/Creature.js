define(['./Entity'], function(Entity){
    
    var Creature = function(sprite){
        Entity.call(this, sprite);
        this._isStatic = false;
    };
    
    Creature.prototype = Object.create(Entity.prototype, {
        constructor: {
            value: Creature,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    
    return Creature;
    
});