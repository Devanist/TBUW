define(['Entities/Platform'], function(Platform){

    var MovingPlatform = function(id, sprite, startPosition, endPosition, time){
        Platform.call(this, id, sprite);
        this._isStatic = false;
        this._data.type = "MovingPlatform";
        this._data.movingSpeedFactor = 1;

        this._startPosition = startPosition;

        this._endPosition = endPosition;

        this._timeToMove = time;

        this._moveBy = {
            x: Math.abs(endPosition.x - startPosition.x) / (this._timeToMove / 1000 * 60),
            y: Math.abs(endPosition.y - startPosition.y) / (this._timeToMove / 1000 * 60)
        };

    };

    MovingPlatform = Object.create(Platform.prototype, {
        constructor: {
            value: MovingPlatform,
            writable: true,
            enumerable: false,
            configurable: true
        }
    });

    var _p = MovingPlatform.prototype;

    _p.update = function(){

        //Platforms moves horizontally
        if(this._moveBy.x !== 0){
            
        }
        //Platforms moves vertically
        else{

        }

    };

    return MovingPlatform;

});