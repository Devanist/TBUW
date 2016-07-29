define([
    'Entities/Creature',
    'Currencies/Currencies'
], 
function(Creature, Currencies){
    
    var Player = function(id, frames){
        Creature.call(this, id, frames[0]);
        this._frames = frames;
        this._data.type = "Player";
        this._data.state = {
            inAir: false,
            doubleJumped: false,
            canDoubleJump: false,
            moving: 0
        };
        this._data.offset.y = 3;
        this._data.offset.width = -3;
        this._data.offset.height = -11;
        this._data.position.endY = this._data.position.y + this._data.size.h;
        this._currencies = new Currencies();
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
    
    _p.collectCurrency = function(currency){
        this._currencies.addQuantity(currency);
    };
    
    _p.nextFrame = function(frame){
        this._sprite.texture = this._frames[frame];
    };
    
    return Player;
    
});