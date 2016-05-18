define([
    'Core/Screen',
    'Core/Stage',
    'Core/Utils',
    'GUI/GUI',
    'Core/TouchController'
    ], function(Screen, Stage, Utils, GUI, TouchController){
    
    var GameScreen = function(){
        Screen.call(this);
        
        this._background = new Stage();
        this._gameStage = new Stage();
        this._guiStage = new Stage();
        this._stage.add(this._background);
        this._stage.add(this._gameStage);
        this._stage.add(this._guiStage);
        this._winConditions = [];
        this._sounds = [];
        
        this._small = 1;
        if(window.innerWidth <= 640){
            this._small = 2;
        }
        
        this._guiStage.add(new GUI.Image("portret", {x: 20 / this._small, y: 20 / this._small}, PIXI.Texture.fromFrame("portret")));
        
        this._guiStage.add(new GUI.Image("blockcoin", {x: 140 / this._small, y: 40 / this._small}, PIXI.Texture.fromFrame("blockcoin")));
        this._guiStage.add(new GUI.Label("blockcoinValue", {x: 190 / this._small, y: 40 / this._small}, 0));
        
        this._touchController = new TouchController();
        if(Utils.isTouchDevice()){
            this._stage.add(this._touchController.getStage());
        }
        this._GRAVITY = 0.7 / this._small;
        this._AIR_RES = 0.2 / this._small;
        this._isPause = false;
        this._updateWorker = new Worker('Screens/GameWorker.js');
        
        //Obsługa zwróconych przez workera danych
        this._updateWorker.onmessage = function(respond){
            
            var anwser = JSON.parse(respond.data);
            if(anwser.WON){
                this._isPause = true;
                var wonLabel = new GUI.Label("wonLabel", "center", "MISSION SUCCESSFUL");
                this._guiStage.add(wonLabel);
                this._guiStage.add(new GUI.Button("wonButton", {x: wonLabel._data.position.x, y: wonLabel._data.position.y + 40 },
                    PIXI.Texture.fromFrame("GUI_Button"), "SUPERB!", {active: true}, 
                    function(){
                        this._onUpdateAction = this.EVENT.CHANGE;
                        this._nextScreen = "menu";
                    }.bind(this)
                ));
            }
            var temp = null;
            this._sounds = anwser.SOUNDS;
            this._gameStage.getStage().position = anwser.CONTAINER;
            
            var l = anwser.ELEMENTS.length;
            for(var i = 0; i < l; i++){
                temp = this._gameStage._elements[i];
                if(this._player === undefined && temp._data.type === "player"){
                    this._player = temp;
                }
                temp._data = anwser.ELEMENTS[i];
                temp._sprite.rotation = anwser.ELEMENTS[i].currentRotationAngle;
                
                if(temp.update){
                    temp.update();
                }
                
                if(temp._data.type === "player" && temp.getPosition().y > 1000){
                    this._isPause = true;
                    
                    var Restart = new GUI.Button("RETRY", {x: window.innerWidth / 2, y: window.innerHeight/2}, PIXI.Texture.fromFrame("GUI_Button"), "RETRY", {active: true}, function(){
                        this._onUpdateAction = this.EVENT.RESTART;
                        this._nextScreen = "game";
                    }.bind(this));
                    
                    this._guiStage.add(Restart);
                }
            }
            
            this._player.nextFrame((this._player._data.state.moving / 10) >> 0);
            
            l = anwser.REMOVE_LIST.length;
            var l2 = this._gameStage._elements.length;
            for(i = 0; i < l; i+=1){
                for(j = 0; j < l2; j+=1){
                    temp = this._gameStage._elements[j];
                    if(anwser.REMOVE_LIST[i] === temp.getId()){
                        
                        if(temp.getType() === "BlockCoin"){
                            if(temp._data.toBeRemoved !== undefined){
                                this._gameStage.remove(anwser.REMOVE_LIST[i]);
                                this._sounds.push("collect_coin");
                            }
                            this._player.collectCurrency(temp.collect());
                        }
                        
                        break;
                        
                    }
                }
            }
            
            l = anwser.GUI_ELEMENTS.length;
            for(i = 0; i < l; i+=1){
                temp = this._guiStage._elements[i];
                temp._data = anwser.GUI_ELEMENTS[i];
                if(temp.getId() === "blockcoinValue"){
                    temp.setText(this._player._currencies.getQuantity("BlockCoin"));
                }
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
    
    _p.getSoundsContainer = function(){
        return this._sounds;
    };
    
    _p.getWinConditions = function(){
        return this._winConditions;
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
            l2 = this._guiStage._elements.length;                
            for(j = 0; j < l; j += 1){
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
                SMALL : this._small,
                CONTAINER: this._gameStage.getStage().position,
                KEYS_STATE: keysState,
                VCONTROLLER: this._touchController.getState(),
                GRAVITY: this._GRAVITY,
                AIR_RES: this._AIR_RES,
                SOUNDS: [],
                ELEMENTS: [],
                GUI_ELEMENTS: [],
                WIN_CONDITIONS: this._winConditions,
                PLAYER_CURRENCIES : {}
            };
            if(this._player !== undefined){
                data.PLAYER_CURRENCIES = {
                    blockcoin: this._player._currencies.getQuantity("BlockCoin")
                };
            }
            
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
        else{
            l = this._guiStage._elements.length;
            for(i = 0; i < l; i+=1){
                temp = this._guiStage._elements[i];
                if(temp.isActive() && keysState.ENTER){
                    temp.triggerCallback();
                }
            }
        }
        
        return {action: this._onUpdateAction, changeTo: this._nextScreen, playSound: this._sounds};
    };
    
    return GameScreen;
    
});