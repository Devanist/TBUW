define([
    'Core/Stage',
    'Core/Utils',
    'Core/TouchController'
    ], function(Stage, Utils, TouchController){
    
    var GameScreen = function(){
        this._gameStage = new Stage();
        if(Utils.isTouchDevice()){
            this._touchController = new TouchController();
            this._gameStage.getStage().addChild(this._touchController.getStage());
        }
        this._player = null;
        this._GRAVITY = 0.7;
        this._AIR_RES = 0.2;
        this._updateWorker = new Worker('Screens/GameWorker.js');
        this._updateWorker.onmessage = function(respond){
            var anwser = JSON.parse(respond.data);
            this._gameStage.getStage().position.x = anwser.CONTAINER.x;
            this._gameStage.getStage().position.y = anwser.CONTAINER.y;
            this._gameStage.getStage().position.endX = anwser.CONTAINER.endX;
            this._gameStage.getStage().position.endY = anwser.CONTAINER.endY;
            for(var i = 0; i < this._gameStage._elements.length; i++){
                this._gameStage._elements[i]._data = anwser.ELEMENTS[i];
                if(this._gameStage._elements[i].update){
                    this._gameStage._elements[i].update();
                }
            }
        }.bind(this);
    };
    
    GameScreen.prototype = {
        
        getStage : function(){
            return this._gameStage;
        },
        
        init : function(){
            this._player = this._gameStage.getElement("mainPlayer");
        },
        
        getPlayer : function(){
            return this._player;
        },
        
        update : function(keysState){
            
            var data = {
                CONTAINER: this._gameStage.getStage().position,
                KEYS_STATE: keysState,
                GRAVITY: this._GRAVITY,
                AIR_RES: this._AIR_RES,
                ELEMENTS: []
            };
            for(var i = 0; i < this._gameStage._elements.length; i++){
                this._gameStage._elements[i]._data.size.w = this._gameStage._elements[i]._sprite.getLocalBounds().width;
                this._gameStage._elements[i]._data.size.h = this._gameStage._elements[i]._sprite.getLocalBounds().height;
                data.ELEMENTS.push(this._gameStage._elements[i]._data); 
            }
            this._updateWorker.postMessage(JSON.stringify(data));
        }
        
    };
    
    return GameScreen;
    
});