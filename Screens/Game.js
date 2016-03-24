define([
    'Core/Stage',
    'Core/Keyboard'
    ], function(Stage, Keyboard){
    
    var GameScreen = function(){
        this._gameStage = new Stage();
        this._player = null;
        this._GRAVITY = 0.5;
        this._AIR_RES = 0.2;
    };
    
    GameScreen.prototype = {
        
        getStage : function(){
            return this._gameStage;
        },
        
        init : function(){
            this._player = this._gameStage.getElement("mainPlayer");
        },

        keyboardHandler: function (event) {
            if (event.keyCode === Keyboard.KEYS.ARROW_RIGHT || event.keyCode === Keyboard.KEYS.D) {
                this._player.updateVelocity({x: 5, y: 0});
            }
            else if (event.keyCode === Keyboard.KEYS.ARROW_LEFT || event.keyCode === Keyboard.KEYS.A) {
                this._player.updateVelocity({x: -5, y: 0});
            }
            else if (event.keyCode === Keyboard.KEYS.ARROW_UP || event.keyCode === Keyboard.KEYS.W) {
                this._player.updateVelocity({x: 0, y: -5});
            }
            else if (event.keyCode === Keyboard.KEYS.ARROW_DOWN || event.keyCode === Keyboard.KEYS.S) {
                this._player.updateVelocity({x: 0, y: 5});
            }
        },
        
        getPlayer : function(){
            return this._player;
        },
        
        update : function(){
            this._player.updatePosition();
            this._player.updateVelocity(
                {
                    x: -(this._player.getVelocityX() * this._AIR_RES),
                    y: -(this._player.getVelocityY() * this._GRAVITY)
                }
            );
        }
        
    };
    
    return GameScreen;
    
});