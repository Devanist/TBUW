define(['Currencies/BlockCoin'], function(BlockCoin){
    
    var Currencies = function(){
        this._currencies = {
            BlockCoin : new BlockCoin()
        };
    };
    
    Currencies.prototype = {
        
        /**
         * Returns quantity of given currency
         */
        getQuantity : function(name){
            if(this._currencies.hasOwnProperty(name)){
                return this._currencies[name].getQuantity;
            }
        },
        
        /**
         * Returns reference to given currency
         */
        get : function(name){
            if(this._currencies.hasOwnProperty(name)){
                return this._currencies[name];
            }
        }
    };
    
    return Currencies;
    
});