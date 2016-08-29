define(['Entities/Item'], function(Item){

    var Obstacle = function(id, frames){
        Item.call(this, id, frames[0]);
        this._frames = frames;
        this._data.type = "Obstacle";
        this._data.state = {
            firstNoLoseFrame: 0,
            lastNoLoseFrame: 0,
            currentFrame: 0            
        };
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
        this._data.state.currentFrame++;
    };

    _p.isLosingFrame = function(frameId){
        return frameId > this._data.state.lastNoLoseFrame;
    };

    return Obstacle;

});