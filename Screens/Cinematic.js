define([
    'Core/Screen'
],
function(Screen){
    
    var Cinematic = function(params){
        Screen.call(this);
        this._loaded = false;
        this._finished = false;
        this._beginTime = 0;
        this._currentTime = 0;
        this._currentAnimation = 0;
        this._stepCounter = 0;
        this._animatedObject = null;
        this._animationComplete = false;
        this._cinematicConfig = [];
        this._sounds = [];
        this._date = new Date();
        this._back = params.back;
    };
    
    Cinematic.prototype = Object.create(Screen.prototype, {
        constructor:{
            value: Cinematic,
            writable: true,
            configurable: true,
            enumerable: false
        }
    });
    
    var _p = Cinematic.prototype;
    
    _p.hasLoaded = function(){
        this._loaded = true;
    };
    
    _p.getConfig = function(){
        return this._cinematicConfig;
    };
    
    _p.setMusic = function(sound){
        sound.effect = "fadeIn";
        this._sounds.push({name: sound});
    };

    _p.update = function(){
        
        if(!this._finished){
        
            var diff = 0;
            if(this._loaded){
                if(this._currentAnimation < this._cinematicConfig.length){
                    
                    this._animatedObject = this._stage.getElement(this._cinematicConfig[this._currentAnimation].id);
                    
                    if(this._animationComplete === false){
                        if(this._cinematicConfig[this._currentAnimation].moveTo.time === 0){
                            this._animatedObject.setPosition({x: this._cinematicConfig[this._currentAnimation].moveTo.x, y: this._cinematicConfig[this._currentAnimation].moveTo.y});
                            this._animationComplete = true;
                        }
                        else{
                            if(this._stepCounter === 0){
                                this._step = {
                                    x: -(this._animatedObject.getPosition().x - this._cinematicConfig[this._currentAnimation].moveTo.x) / this._cinematicConfig[this._currentAnimation].moveTo.time,
                                    y: -(this._animatedObject.getPosition().y - this._cinematicConfig[this._currentAnimation].moveTo.y) / (this._cinematicConfig[this._currentAnimation].moveTo.time / 16.666)
                                };
                            }
                            this._animatedObject.move(this._step);
                            this._stepCounter++;
                            if(this._stepCounter >= this._cinematicConfig[this._currentAnimation].moveTo.time / 16.666){
                                this._animatedObject.setPosition({x: this._cinematicConfig[this._currentAnimation].moveTo.x, y: this._cinematicConfig[this._currentAnimation].moveTo.y});
                                this._animationComplete = true;
                                this._beginTime = 0;
                                this._stepCounter = 0;
                            }
                        }
                    }
                    
                    if(this._animationComplete === true){
                        if(this._cinematicConfig[this._currentAnimation].moveTo.wait === 0){
                            this._currentAnimation++;
                            this._animationComplete = false;
                        }
                        else{
                            if(this._beginTime === 0){
                                this._beginTime = Date.now();
                            }
                            this._currentTime = Date.now();
                            diff = this._currentTime - this._beginTime;
                            if(diff >= this._cinematicConfig[this._currentAnimation].moveTo.wait){
                                this._currentAnimation++;
                                this._animationComplete = false;
                                this._step = 0;
                            }
                        }
                    }
                    
                }
                else{
                    this._finished = true;
                }
            }
        }
        else{
            if(this._stage._stage.alpha > -1){
                this._stage._stage.alpha -= 0.01;
            }
            else{
                this._onUpdateAction = "CHANGE";
                this._nextScreen = "level_choose";
                this._nextScreenParams = {
                    cfg: this._back
                };
            }
        }
        return {action: this._onUpdateAction, params: this._nextScreenParams, changeTo: this._nextScreen, playSound: this._sounds};
    };
    
    return Cinematic;
    
});