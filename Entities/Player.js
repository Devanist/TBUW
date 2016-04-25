define([
    'Entities/Creature',
    'Currencies/Currencies'
], 
function(Creature, Currencies){
    
    var Player = function(id, sprite){
        Creature.call(this, id, sprite);
        this._data.type = "player";
        this._data.state = {
            inAir: false
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
    
    return Player;
    
});