define([
    'Core/Screen'
],
function(Screen){
    
    var Cinematic = function(){
        Screen.call(this);
        this._loaded = false;
        this._finished = false;
        this._beginTime = 0;
        this._currentTime = 0;
        this._currentAnimation = 0;
        this._animatedObject = null;
        this._cinematicConfig = [];
        this._sounds = [];
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
    
    _p.update = function(){
        
        if(this._loaded){
            if(this._currentAnimation < this._cinematicConfig.length){
                this._animatedObject = this._stage.getElement(this._cinematicConfig[this._currentAnimation].id);
                if(this._cinematicConfig[this._currentAnimation].moveTo.time === 0){
                    this._animatedObject.setPosition({x: this._cinematicConfig[this._currentAnimation].moveTo.x, y: this._cinematicConfig[this._currentAnimation].moveTo.y});
                }
                if(this._cinematicConfig[this._currentAnimation].moveTo.wait === 0){
                    this._currentAnimation++;
                }
            }
            else{
                this._finished = true;
            }
        }
        
        if(this._finished){
            this._onUpdateAction = "CHANGE";
            this._nextScreen = "game";
        }
        return {action: this._onUpdateAction, changeTo: this._nextScreen, playSound: this._sounds};
    };
    
    return Cinematic;
    
});