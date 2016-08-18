define([
    'Core/Screen',
    'Core/Stage',
    'Core/Utils',
    'GUI/GUI',
    'Core/TouchController'
    ], function(Screen, Stage, Utils, GUI, TouchController){
    
    var GameScreen = function(params){
        Screen.call(this);
        this._background = new Stage();
        this._gameStage = new Stage();
        this._guiStage = new Stage();
        this._stage.add(this._background);
        this._stage.add(this._gameStage);
        this._stage.add(this._guiStage);
        this._winConditions = [];
        this._sounds = [];
        this._lose = false;
        this._music = null;
        this._back = params.back;
        this._retry = params;
        
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
        this.escapeDown = true;
        this._isPause = false;
        this._updateWorker = new Worker('Screens/GameWorker.js');
        
        //Obsługa zwróconych przez workera danych
        this._updateWorker.onmessage = function(respond){
            
            var anwser = JSON.parse(respond.data);
            if(anwser.WON){
                this._isPause = true;
                var wonLabel = new GUI.Label("wonLabel", "center", "MISSION SUCCESSFUL", {
                    bitmap: true, 
                    font: 40 / this._small + "px Cyberdyne Expanded", 
                    fill: 0xff4fff, 
                    align: "center"
                });
                this._guiStage.add(wonLabel);
                wonLabel.move({x:0, y: -100});
                var wonButton = new GUI.Button("wonButton", "center",
                    PIXI.Texture.fromFrame("GUI_Button"), "SUPERB!", 
                    {
                        active: true,
                        bitmap: true, 
                        font: 30 / this._small + "px Cyberdyne Expanded", 
                        fill: 0xff4fff, 
                        align: "center"
                    }, 
                    function(){
                        this._onUpdateAction = this.EVENT.CHANGE;
                        this._nextScreen = "level_choose";
                        this._nextScreenParams = {
                            cfg: this._back
                        };
                    }.bind(this)
                );
                this._guiStage.add(wonButton);
            }
            var temp = null;
            this._sounds = anwser.SOUNDS;
            this._gameStage.getStage().position = anwser.CONTAINER;
            
            for(let i = 0; i < anwser.ELEMENTS.length; i++){
                temp = this._gameStage._elements[i];
                if(this._player === undefined && temp._data.type === "Player"){
                    this._player = temp;
                }
                temp._data = anwser.ELEMENTS[i];
                temp._sprite.rotation = anwser.ELEMENTS[i].currentRotationAngle;
                
                if(temp.update){
                    temp.update();
                }
                
                if(temp._data.type === "Player" && temp.getPosition().y > 1000){
                    this._lose = true;
                }

                if(this._lose === true){
                    this._isPause = true;
                    this._updateWorker.terminate();
                    var YouLose = new GUI.Label("LOSE", "center", "YOU LOSE", 
                        {
                            bitmap: true, 
                            font: 40 / this._small + "px Cyberdyne Expanded", 
                            fill: 0xff4fff, 
                            align: "center"
                        }
                    );
                    YouLose.move({x: 0, y: -100});
                    this._guiStage.add(YouLose);
                    console.log(YouLose);
                    var loseButton = new GUI.Button("RETRY", "center",
                        PIXI.Texture.fromFrame("GUI_Button"), "RETRY", 
                        {
                            active: true,
                            bitmap: true, 
                            font: 30 / this._small + "px Cyberdyne Expanded", 
                            fill: 0xff4fff, 
                            align: "center"
                        }, 
                        function(){
                            this._onUpdateAction = this.EVENT.RESTART;
                            this._nextScreen = "game";
                            this._nextScreenParams = this._retry;
                        }.bind(this)
                    );
                    loseButton.move({x: 0, y: 0});
                    this._guiStage.add(loseButton);
                }
            }
            
            this._player.nextFrame((this._player._data.state.moving / 10) >> 0);
            
            for(let i = 0; i < anwser.REMOVE_LIST.length; i+=1){
                for(let j = 0; j < this._gameStage._elements.length; j+=1){
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
            
            for(let i = 0; i < anwser.GUI_ELEMENTS.length; i+=1){
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

    _p.setMusic = function(music){
        console.log(music);
        this._music = music;
        console.log(this._music);
    };
    
    _p.getWinConditions = function(){
        return this._winConditions;
    };

    _p.pauseHandler = function(){
        if(this.escapeDown){
                this._isPause = !this._isPause;
                this.escapeDown = false;

                if(this._isPause === true){

                    let pauseBG = new GUI.Image("pauseBackground", "center", PIXI.Texture.fromFrame("pause"));
                    pauseBG.move({x: 50, y: 0});
                    this._guiStage.add(pauseBG);

                    let pauseLabel = new GUI.Label("pauseLabel", "center", "PAUSE",
                        {
                                bitmap: true, 
                                font: 40 / this._small + "px Cyberdyne Expanded", 
                                fill: 0xff4fff, 
                                align: "center"
                        }
                    );
                    pauseLabel.move({x: 100, y: -100});
                    this._guiStage.add(pauseLabel);

                    let resumeButton = new GUI.Button("resumeButton", "center", null, "RESUME", {
                            active: true,
                            size_override: false,
                            bitmap: true, 
                            font: 40 / this._small + "px Cyberdyne Expanded", 
                            fill: 0xff4fff, 
                            align: "center"
                        },
                        function(){
                            this.escapeDown = true;
                            this.pauseHandler();
                    }.bind(this));
                    resumeButton.move({x:20, y: 50});
                    this._guiStage.add(resumeButton);

                    let returnButton = new GUI.Button("returnButton", "center", null, "ABANDON", {
                            size_override: false,
                            bitmap: true,
                            font: 40 / this._small + "px Cyberdyne Expanded",
                            fill: 0xff4fff,
                            align: "center"
                        },
                        function(){
                            this._onUpdateAction = this.EVENT.CHANGE;
                            this._nextScreen = "level_choose";
                            this._nextScreenParams = {
                                cfg: this._back
                            };
                    }.bind(this));
                    returnButton.move({x: 0, y: 100});
                    this._guiStage.add(returnButton);
                }
                else{
                    this._guiStage.remove("pauseBackground");
                    this._guiStage.remove("pauseLabel");
                    this._guiStage.remove("resumeButton");
                    this._guiStage.remove("returnButton");
                }

            }
    }
        
    /**
     * Metoda przygotowująca dane i wysyłająca je do workera.
     * @param {object} keysState Obecny stan klawiszy.
     */
    _p.update = function(keysState, clicks, touches, touchController){
        
        //Background scaling
        this._background._elements[0]._sprite.width = this._background._elements[0]._sprite._texture.baseTexture.realWidth * window.innerWidth / window.innerHeight;
        
        var temp = null;
        
        //Mouse clicks handling
        for(let j = 0; j < clicks.length; j += 1){
            for(let i = 0; i < this._guiStage._elements.length; i += 1){
                temp = this._guiStage._elements[i];
                if(temp.triggerCallback && temp._sprite.containsPoint({x: clicks[j].x, y: clicks[j].y})){
                    temp.triggerCallback();
                }
            }
        }
        
        //Touch handling
        if(Utils.isTouchDevice()){
            this._touchController.updateState(touches);                
            for(let j = 0; j < touches.length; j += 1){
                for(let i = 0; i < this._guiStage._elements.length; i += 1){
                    temp = this._guiStage._elements[i];
                    if(temp.triggerCallback && temp._sprite.containsPoint({x: touches[j].pageX, y: touches[j].pageY})){
                        temp.triggerCallback();
                    }                     
                }                    
            }
        }

        //Handling escape key here, because if pause is on, worker is not working.
        if(keysState.ESCAPE){
            this.pauseHandler();
        }
        else{
            this.escapeDown = true;
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
                SOUNDS: [this._music],
                PAUSE: this._isPause,
                ELEMENTS: [],
                GUI_ELEMENTS: [],
                WIN_CONDITIONS: this._winConditions,
                PLAYER_CURRENCIES : {}
            };
            if(this._player !== undefined){
                data.PLAYER_CURRENCIES = {
                    BlockCoin: this._player._currencies.getQuantity("BlockCoin")
                };
            }
            
            l = this._gameStage._elements.length;
            for(let i = 0; i < l; i++){
                temp = this._gameStage._elements[i];
                temp._data.size.w = temp._sprite.getLocalBounds().width;
                temp._data.size.h = temp._sprite.getLocalBounds().height;
                data.ELEMENTS.push(temp._data); 
            }
            
            l = this._guiStage._elements.length;
            for(let i = 0; i < l; i+=1){
                temp = this._guiStage._elements[i];
                data.GUI_ELEMENTS.push(temp._data);
            }
            
            this._updateWorker.postMessage(JSON.stringify(data));
        
        }
        else{
            l = this._guiStage._elements.length;
            for(let i = 0; i < l; i+=1){
                temp = this._guiStage._elements[i];
                if(temp.isActive() && keysState.ENTER){
                    temp.triggerCallback();
                }
            }
        }
        
        return {action: this._onUpdateAction, params: this._nextScreenParams, changeTo: this._nextScreen, playSound: this._sounds};
    };
    
    return GameScreen;
    
});