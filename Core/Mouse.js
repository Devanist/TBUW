define([], function(){
    
    var Mouse = function(){
        
        this._state = {
            LEFT_BTN: false,
            RIGHT_BTN: false,
            MID_BTN: false
        };
        
        this._clicks = [];
        
    };
    
    Mouse.prototype = {
        
        getMouseState: function(){
            return this._state;
        },
        
        setState: function(key, val){
            this._state[key] = val;
        },
        
        handleLeftBtnDown: function(){
            this.setState("LEFT_BTN", true);
        },
        
        handleLeftBtnUp: function(){
            this.setState("LEFT_BTN", false);
        },
        
        handleLeftClick: function(e){
            this._clicks.push(e);
        },
        
        getClicks : function(){
            return this._clicks.splice(0);
        }
        
    };
    
    return Mouse;
    
});