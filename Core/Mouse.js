define([], function(){
    
    /**
     * Class representates the mouse state.
     */
    var Mouse = function(){
        
        this._state = {
            LEFT_BTN: false,
            RIGHT_BTN: false,
            MID_BTN: false
        };
        
        this._clicks = [];
        
    };
    
    Mouse.prototype = {
        
        /**
         * Method returns mouse state.
         * @returns {object}
         */
        getMouseState: function(){
            return this._state;
        },
        
        /**
         * Method sets the given key state.
         * @param {string} key Key name
         * @param {boolean} val Key state
         */
        setState: function(key, val){
            this._state[key] = val;
        },
        
        /**
         * Method sets the state of a left button to true.
         */
        handleLeftBtnDown: function(){
            this.setState("LEFT_BTN", true);
        },
        
        /**
         * Method sets the state of a left button to false.
         */
        handleLeftBtnUp: function(){
            this.setState("LEFT_BTN", false);
        },
        
        /**
         * Method adds information that click event occured.
         */
        handleLeftClick: function(e){
            this._clicks.push(e);
        },
        
        /**
         * Method returns the array of click events objects.
         * @returns {array}
         */
        getClicks : function(){
            return this._clicks.splice(0);
        }
        
    };
    
    return Mouse;
    
});