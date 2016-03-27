define([
    'Core/Stage',
    'Core/Keyboard'
    ], function(Stage, Keyboard){
    
    var GameScreen = function(){
        this._gameStage = new Stage();
        this._player = null;
        this._GRAVITY = 0.5;
        this._AIR_RES = 0.2;
        this._updateWorker = new Worker('Screens/GameWorker.js');
        this._updateWorker.onmessage = function(respond){
            var anwser = JSON.parse(respond.data);
            this._player.update(anwser.PLAYER);
        }.bind(this);
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
        
        update : function(keysState){
            var data = {
                KEYS_STATE: keysState,
                GRAVITY: this._GRAVITY,
                AIR_RES: this._AIR_RES,
                PLAYER: {
                    position: this._player.getPosition(),
                    velocity: this._player.getVelocity()
                }
            };
            this._updateWorker.postMessage(JSON.stringify(data));
        }
        
    };
    
    return GameScreen;
    
});