define([
    
], function(){
    
    var Keyboard = function(){
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
        this._callbacks = [];
    };
    
    Keyboard.prototype = {
        
        setCallback : function(key, cb){
            this._callbacks[key] = cb;
        },
        
        runCallback : function(event){
            this._callbacks[event.keyCode]();
        }
        
    };
    
    return Keyboard;
    
});