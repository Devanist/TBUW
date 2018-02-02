export default class Mouse {
    constructor () {
        this._state = {
            LEFT_BTN: false,
            RIGHT_BTN: false,
            MID_BTN: false
        };

        this._clicks = [];
    }

    /**
     * Method returns mouse state.
     * @returns {object}
     */
    getMouseState () {
        return this._state;
    }

    /**
     * Method sets the given key state.
     * @param {string} key Key name
     * @param {boolean} val Key state
     */
    setState (key, val) {
        this._state[key] = val;
    }

    /**
     * Method sets the state of a left button to true.
     */
    handleLeftBtnDown () {
        this.setState("LEFT_BTN", true);
    }

    /**
     * Method sets the state of a left button to false.
     */
    handleLeftBtnUp () {
        this.setState("LEFT_BTN", false);
    }

    /**
     * Method adds information that click event occured.
     */
    handleLeftClick (e) {
        this._clicks.push(e);
    }

    /**
     * Method returns the array of click events objects.
     * @returns {array}
     */
    getClicks () {
        return this._clicks.splice(0); // eslint-disable-line no-magic-numbers
    }

    /**
     * Method resets the in-application state of mouse device.
     */
    reset () {
        this._clicks = [];
        for (var btn in this._state) {
            if (this._state.hasOwnProperty(btn)) this._state[btn] = false;
        }
    }
}
