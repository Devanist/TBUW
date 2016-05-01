define([
    'Currencies/BlockCoin',
    'Entities/Collectible'
], 
function(Currency, Collectible){
    
    var BlockCoin = function(id, quantity, position) {
        Collectible.call(this, id, PIXI.Texture.fromFrame("blockcoin"), position);
        this._currency = new Currency();
        this._currency.setQuantity(quantity);
        this._data.type = "BlockCoin";
        this._data.rotation = 0.1;
    };
    
    BlockCoin.prototype = Object.create(Collectible.prototype, {
        constructor: {
            value: BlockCoin,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    
    return BlockCoin;
    
});