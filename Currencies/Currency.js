/**
 * Class representing some currency for example Health Points or gold amount.
 * @class
 */
export default class Currency {
    /**
     * @constructor
     * @param {String} name
     */
    constructor (name) {
        this._name = name;
        this._quantity = 0;
    }

    /**
     * Returns this currency name.
     * @returns {String}
     */
    getName () {
        return this._name;
    }

    /**
     * Returns quantity of this currency.
     * @returns {Number}
     */
    getQuantity () {
        return this._quantity;
    }

    /**
     * Sets the quantity to a given number.
     * @param {Number} number
     */
    setQuantity (number) {
        this._quantity = number;
    }

    /**
     * Changes quantity by given number.
     * @param {Number} number
     */
    addQuantity (number) {
        this._quantity += number;
    }

}
