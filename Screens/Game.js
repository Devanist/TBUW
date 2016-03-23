define([
    'Core/Stage',
    'Core/Keyboard'
    ], function(Stage, Keyboard){
    
    var GameScreen = function(){
        this._gameStage = new Stage();
    };
    
    GameScreen.prototype = {
        
        getStage : function(){
            return this._gameStage;
        },
        
        keyboardHandler: function (event) {
            if (event.keyCode === Keyboard.KEYS.ARROW_RIGHT || event.keyCode === Keyboard.KEYS.D) {
                
            }
            else if (event.keyCode === Keyboard.KEYS.ARROW_LEFT || event.keyCode === Keyboard.KEYS.A) {
                
            }
            else if (event.keyCode === Keyboard.KEYS.ARROW_UP || event.keyCode === Keyboard.KEYS.W) {
                
            }
            else if (event.keyCode === Keyboard.KEYS.ARROW_DOWN || event.keyCode === Keyboard.KEYS.S) {
                
            }
        }
        
    };
    
    return GameScreen;
    
});