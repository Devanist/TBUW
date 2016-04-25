define([
    'Currencies/Currency'
], 
function(Currency){
    
    var BlockCoin = function(){
        Currency.call(this, "BlockCoin");
    };
    
    BlockCoin.prototype = Object.create(Currency.prototype, {
        constructor: {
            value: BlockCoin,
            writable: true,
            configurable: true,
            enumerable: false
        }
    });
    
    var _p = BlockCoin.prototype;
    
    return BlockCoin;
    
});