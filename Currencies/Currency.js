define([], function(){
    
    /**
     * Class representing some currency for example Health Points or gold amount.
     * @param {string} name
     */
    var Currency = function(name){
        this._name = name;
        this._quantity = 0;
    };
    
    Currency.prototype = {
        
        /**
         * Returns this currency name.
         * @returns {string}
         */
        getName : function(){
            return this._name;
        },
        
        /**
         * Returns quantity of this currency.
         * @returns {number}
         */
        getQuantity : function(){
            return this._quantity;
        },
        
        /**
         * Sets the quantity to a given number.
         * @param {number} number
         */
        setQuantity : function(number){
            this._quantity = number;
        },
        
        addQuantity : function(number){
            this._quantity += number;
        }
        
    };
    
    return Currency;
});