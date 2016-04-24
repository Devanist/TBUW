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
        this._background = new Stage();
        this._gameStage = new Stage();
        this._guiStage = new Stage();
        this._stage.add(this._background);
        this._stage.add(this._gameStage);
        this._stage.add(this._guiStage);
        
        this._guiStage.add(new GUI.Image("portret", {x: 20, y: 20}, PIXI.loader.resources.portret.texture));
        
        this._guiStage.add(new GUI.Image("blockcoin", {x: 140, y: 40}, PIXI.loader.resources.blockcoin.texture));
        
        this._touchController = new TouchController();
        if(Utils.isTouchDevice()){
            this._stage.add(this._touchController.getStage());
        }
        this._GRAVITY = 0.7;
        this._AIR_RES = 0.2;
        this._isPause = false;
        this._updateWorker = new Worker('Screens/GameWorker.js');
        
        //Obsługa zwróconych przez workera danych
        this._updateWorker.onmessage = function(respond){
            
            var anwser = JSON.parse(respond.data);
            var temp = null;
            this._gameStage.getStage().position = anwser.CONTAINER;
            
            var l = anwser.ELEMENTS.length;
            for(var i = 0; i < l; i++){
                temp = this._gameStage._elements[i];
                temp._data = anwser.ELEMENTS[i];
                temp._sprite.rotation = anwser.ELEMENTS[i].currentRotationAngle;
                
                if(temp.update){
                    temp.update();
                }
                
                if(temp._data.type === "player" && temp.getPosition().y > 1000){
                    this._isPause = true;
                    
                    var Restart = new GUI.Button("RETRY", {x: window.innerWidth / 2, y: window.innerHeight/2}, PIXI.loader.resources.GUI_Button.texture, "RETRY", {}, function(){
                        this._onUpdateAction = this.EVENT.RESTART;
                        this._nextScreen = "game";
                    }.bind(this));
                    
                    this._guiStage.add(Restart);
                }
            }
            
            l = anwser.REMOVE_LIST.length;
            for(i = 0; i < l; i+=1){
                //obsługa usuwanych elementów
            }
            
            l = anwser.GUI_ELEMENTS.length;
            for(i = 0; i < l; i+=1){
                temp = this._guiStage._elements[i];
                temp._data = anwser.GUI_ELEMENTS[i];
                temp._sprite.rotation = temp._data.currentRotationAngle;
            }
            
        }.bind(this);
        
    };
    
    GameScreen.prototype = Object.create(Screen.prototype, {
        constructor: {
            value: GameScreen,
            enumerable: false,
            configurable: true,
            writable: true
        }
    });
    
    var _p = GameScreen.prototype;
        
    _p.getMainStage = function(){
        return this._gameStage;
    };
        
    /**
     * Metoda przygotowująca dane i wysyłająca je do workera.
     * @param {object} keysState Obecny stan klawiszy.
     */
    _p.update = function(keysState, clicks, touches, touchController){
        
        //Background scaling
        this._background._elements[0]._sprite.width = this._background._elements[0]._sprite._texture.baseTexture.realWidth * window.innerWidth / window.innerHeight;
        
        var temp = null;
        
        //Mouse clicks handling
        var l = clicks.length;
        var l2 = this._guiStage._elements.length;
        for(var j = 0; j < l; j += 1){
            for(var i = 0; i < l2; i += 1){
                temp = this._guiStage._elements[i];
                if(temp._sprite.containsPoint({x: clicks[j].x, y: clicks[j].y})){
                    temp.triggerCallback();
                }
            }
        }
        
        //Touch handling
        if(Utils.isTouchDevice()){
            l = touches.length;
            this._touchController.updateState(touches);
            var l3 = this._touchController.getStage()._elements.length;                
            for(var j = 0; j < l; j += 1){
                for(i = 0; i < l2; i += 1){
                    temp = this._guiStage._elements[i];
                    if(temp._sprite.containsPoint({x: touches[j].pageX, y: touches[j].pageY})){
                        temp.triggerCallback();
                    }                     
                }                    
            }
        }
        
        if(!this._isPause){
        
            //Preparing data and sending it to worker.
            var data = {
                CONTAINER: this._gameStage.getStage().position,
                KEYS_STATE: keysState,
                VCONTROLLER: this._touchController.getState(),
                GRAVITY: this._GRAVITY,
                AIR_RES: this._AIR_RES,
                ELEMENTS: [],
                GUI_ELEMENTS: []
            };
            
            l = this._gameStage._elements.length;
            for(i = 0; i < l; i++){
                temp = this._gameStage._elements[i];
                temp._data.size.w = temp._sprite.getLocalBounds().width;
                temp._data.size.h = temp._sprite.getLocalBounds().height;
                data.ELEMENTS.push(temp._data); 
            }
            
            l = this._guiStage._elements.length;
            for(i = 0; i < l; i+=1){
                temp = this._guiStage._elements[i];
                data.GUI_ELEMENTS.push(temp._data);
            }
            
            this._updateWorker.postMessage(JSON.stringify(data));
        
        }
        
        return {action: this._onUpdateAction, changeTo: this._nextScreen};
    };
    
    return GameScreen;
    
});