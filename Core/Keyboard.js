define([

], function () {

        var Keyboard = function () {

            //Lista klawiszy z ich kodami
            this.KEYS = {
                ARROW_UP: 38,
                ARROW_DOWN: 40,
                ARROW_LEFT: 37,
                ARROW_RIGHT: 39,
                W: 87,
                S: 83,
                A: 65,
                D: 68
            };

            //Lista stanów klawiszy
            this._state = {
                ARROW_UP: false,
                ARROW_DOWN: false,
                ARROW_LEFT: false,
                ARROW_RIGHT: false,
                W: false,
                S: false,
                A: false,
                D: false
            };
        
    };
    
    
    Keyboard.prototype = {
        
        /**
         * Metoda zwracająca stan klawiszy.
         * @returns {object}
         */
        getKeysState: function () {
            return this._state;
        },
        
        /**
         * Metoda zmieniająca stan danego klawisza na podany.
         * @param {string} key Nazwa klawisza
         * @param {boolean} val Stan określający, czy klawisz jest wciśnięty, czy nie
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
        
        handleKeyDown: function (event) {
            this.setKeyState(event.keyCode, true);
        },
        
        handleKeyUp : function(event){
            this.setKeyState(event.keyCode, false);
        }
        
    };
    
    return Keyboard;
    
});