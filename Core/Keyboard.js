/**
 * Class representing the keyboard state.
 */
class Keyboard{
    constructor(){

        //List of keys and their codes.
        this.KEYS = {
            ARROW_UP: 38,
            ARROW_DOWN: 40,
            ARROW_LEFT: 37,
            ARROW_RIGHT: 39,
            ENTER: 13,
            ESCAPE: 27,
            CTRL: 17,
            W: 87,
            S: 83,
            A: 65,
            D: 68
        };

        //List of states of keys
        this._state = {
            ARROW_UP: false,
            ARROW_DOWN: false,
            ARROW_LEFT: false,
            ARROW_RIGHT: false,
            ENTER: false,
            ESCAPE: false,
            CTRL : false,
            W: false,
            S: false,
            A: false,
            D: false
        };

    }

    /**
     * Method returns the keyboard's state.
     * @returns {Object}
     */
    getKeysState(){
        return this._state;
    }
    
    /**
     * Method changes the given key state.
     * @param {String} key Name or code of key
     * @param {Boolean} val Key's new state
     */
    setKeyState(key, val) {
        if(typeof key === "string") {
            this._state[key] = val;
        }
        else if(typeof key === "number"){
            for(var k in this.KEYS){
                if(this.KEYS.hasOwnProperty(k) && this.KEYS[k] === key){
                    this._state[k] = val;
                }
            }
        }
    }
    
    /**
     * Setting the key state to true
     * @param {object} event Keyboard event
     */
    handleKeyDown(event){
        this.setKeyState(event.keyCode, true);
    }
    
    /**
     * Setting the key state to false
     * @param {object} event Keyboard event
     */
    handleKeyUp(event){
        this.setKeyState(event.keyCode, false);
    }
    
    reset(){
        for(var k in this._state){
            if(this._state.hasOwnProperty(k)){
                this._state[k] = false;
            }
        }
    }

}

export default Keyboard;