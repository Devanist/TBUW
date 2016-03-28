define(['Entities/Creature'], function(Creature){
    
    var Player = function(id, sprite){
        Creature.call(this, id, sprite);
        this._data.type = "player";
    };
    
    Player.prototype = Object.create(Creature.prototype, {
        constructor: {
            value: Player,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    
    var _p = Player.prototype;
    
    return Player;
    
});