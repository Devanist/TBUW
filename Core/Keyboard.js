define([

], function () {

    /**
     * Class representing the keyboard state.
     */
    var Keyboard = function () {

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
    
};
    
    
    Keyboard.prototype = {
        
        /**
         * Method returns the keyboard's state.
         * @returns {object}
         */
        getKeysState: function () {
            return this._state;
        },
        
        /**
         * Method changes the given key state.
         * @param {string} key Name or code of key
         * @param {boolean} val Key's new state
         */
        setKeyState: function (key, val) {
            if (typeof (key) === "string") {
                this._state[key] = val;
            }
            else if (typeof(key) === "number"){
                for(var k in this.KEYS){
                    if(this.KEYS.hasOwnProperty(k) && this.KEYS[k] === key){
                        this._state[k] = val;
                    }
                }
            }
        },
        
        /**
         * Setting the key state to true
         * @param {object} event Keyboard event
         */
        handleKeyDown: function (event) {
            this.setKeyState(event.keyCode, true);
        },
        
        /**
         * Setting the key state to false
         * @param {object} event Keyboard event
         */
        handleKeyUp : function(event){
            this.setKeyState(event.keyCode, false);
        },
        
        reset : function(){
            for(var k in this._state){
                if(this._state.hasOwnProperty(k)){
                    this._state[k] = false;
                }
            }
        }
        
    };
    
    return Keyboard;
    
});