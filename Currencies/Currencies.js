import BlockCoinCurrency from './BlockCoin';
    
class Currencies{

    constructor(){
        this._currencies = {
            BlockCoin : new BlockCoinCurrency()
        };
    };

    /**
     * Returns quantity of given currency
     */
    getQuantity(name){
        if(this._currencies.hasOwnProperty(name)){
            return this._currencies[name].getQuantity();
        }
    }
    
    /**
     * Returns reference to given currency
     */
    get(name){
        if(this._currencies.hasOwnProperty(name)){
            return this._currencies[name];
        }
    }
    
    addQuantity(currency){
        this._currencies[currency.name].addQuantity(currency.quantity);
    }

}

export default Currencies;