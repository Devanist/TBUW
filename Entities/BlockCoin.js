define([
    'Currencies/BlockCoin',
    'Entities/Collectible'
], 
function(Currency, Collectible){
    
    var BlockCoin = function(quantity, position) {
        Collectible.call(this, "blockcoin", position);
        this._currency = new BlockCoin();
        this._currency.setQuantity(quantity);
    };
    
});