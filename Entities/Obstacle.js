define(['Entities/Item'], function(Item){

    var Obstacle = function(id, frames, config){
        Item.call(this, id, frames[0]);
        this._frames = frames;
        this._data.type = "Obstacle";
        this._data.state = {
            firstNoLoseFrame: config.firstNoLoseFrame,
            lastNoLoseFrame: config.lastNoLoseFrame,
            currentFrame: 0         
        };
        this._config = config;
        this._timestamp = Date.now();
    };

    Obstacle.prototype = Object.create(Item.prototype, {
        constructor: {
            value: Obstacle,
            configurable: true,
            enumerable: false,
            writable: true
        }
    });

    var _p = Obstacle.prototype;

    _p.update = function(){

        if(this._data.state.currentFrame === 0){
            if(Date.now() - this._timestamp > this._config.wait){
                this._data.state.currentFrame++;
            }
        }
        else{
            if(this._loopCounter > this._config.loopLength){
                this._data.state.currentFrame = 0;
                this._timestamp = Date.now();
            }
            else{
                if(this._data.state.currentFrame < this._config.loopEndFrame){
                    this._data.state.currentFrame++;
                }
                else{
                    this._data.state.currentFrame = this._config.loopStartFrame;
                }
            }
        }

    };

    _p.isLosingFrame = function(frameId){
        return frameId > this._data.state.lastNoLoseFrame;
    };

    return Obstacle;

});