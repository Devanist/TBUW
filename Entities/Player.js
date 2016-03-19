define(['./Creature'], function(Creature){
    
    var Player = function(sprite){
        Creature.call(this, sprite);
    };
    
    Player.prototype = Object.create(Creature.prototype, {
        constructor: {
            value: Player,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    
    return Player;
    
});