define([
    'Core/Screen',
    'Core/Stage',
    'Core/Utils',
    'Core/Keyboard',
    'GUI/GUI',
    'Core/TouchController'
    ], function(Screen, Stage, Utils, Keyboard, GUI, TouchController){
    
    var GameScreen = function(){
        Screen.call(this);
        this._gameStage = new Stage();
        this._guiStage = new Stage();
        this._stage.add(this._gameStage);
        this._stage.add(this._guiStage);
        if(Utils.isTouchDevice()){
            this._touchController = new TouchController();
            this._gameStage.getStage().addChild(this._touchController.getStage());
        }
        this._GRAVITY = 0.7;
        this._AIR_RES = 0.2;
        this._isPause = false;
        this._updateWorker = new Worker('Screens/GameWorker.js');
        
        //Obsługa zwróconych przez workera danych
        this._updateWorker.onmessage = function(respond){
            
            var anwser = JSON.parse(respond.data);
            
            this._gameStage.getStage().position = anwser.CONTAINER;
            
            for(var i = 0; i < anwser.ELEMENTS.length; i++){
                var temp = this._gameStage._elements[i];
                temp._data = anwser.ELEMENTS[i];
                
                if(temp.update){
                    temp.update();
                }
                
                if(temp._data.type === "player" && temp.getPosition().y > 1000){
                    var player = temp;
                    this._isPause = true;
                    var Restart = new GUI.Button("RETRY", {x: 500, y: 500}, function(){
                        this._onUpdateAction = this.EVENT.RESTART;
                        this._nextScreen = "game";
                    }.bind(this));
                    Restart.init(GUI.Button._spriteSource);
                    this._guiStage.add(Restart);
                    console.log(this._guiStage.getStage());
                    console.log(this._gameStage.getStage());
                }
            }
            
        }.bind(this);
        
    };
    
    GameScreen.prototype = {
        
        /**
         * Dodaje elementy GUI do Stage po poprzednim załadowaniu poziomu, aby GUI rysowało się nad wszystkim innym.
         */
        loadGUI : function(){
            
        },
        
        getGameStage : function(){
            return this._gameStage;
        },
        
        getStage : function(){
            return this._stage;
        },
        
        /**
         * Metoda przygotowująca dane i wysyłająca je do workera.
         * @param {object} keysState Obecny stan klawiszy.
         */
        update : function(keysState, clicks){
            
            for(var j = 0; j < clicks.length; j += 1){
                for(var i = 0; i < this._guiStage._elements.length; i += 1){
                    if(this._guiStage._elements[i]._sprite.containsPoint({x: clicks[j].x, y: clicks[j].y})){
                        this._guiStage._elements[i].triggerCallback();
                    }
                }
            }
            
            if(!this._isPause){
            
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
            
            return {action: this._onUpdateAction, changeTo: this._nextScreen};
        }
        
    };
    
    return GameScreen;
    
});