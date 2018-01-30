import BlockCoinCurrency from './BlockCoin';

export default class Currencies {
    constructor () {
        this._currencies = {
            BlockCoin: new BlockCoinCurrency()
        };
    };

    /**
     * Returns quantity of given currency
     */
    getQuantity (name) {
        if (name in this._currencies) {
            return this._currencies[name].getQuantity();
        }
        throw new Error(`Trying to get quantity of currency that this object does not have: ${name}`);
    }

    /**
     * Returns reference to given currency
     */
    get (name) {
        if (name in this._currencies) {
            return this._currencies[name];
        }
        throw new Error(`Trying to get reference to currency that this object does not have: ${name}`);
    }

    addQuantity (currency) {
        const { name, quantity } = currency;
        this._currencies[name].addQuantity(quantity);
    }

}
