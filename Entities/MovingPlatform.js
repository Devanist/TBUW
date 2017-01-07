define(['Entities/Platform'], function(Platform){

    var MovingPlatform = function(id, sprite, startPosition, endPosition, time){
        Platform.call(this, id, sprite);
        this._small = 1;
        if(window.innerWidth <= 640){
            this._small = 2;
        }
        this._isStatic = false;
        this._data.type = "MovingPlatform";
        this._data.movingSpeedFactor = 1;

        this._startPosition = {
            x: startPosition.x / this._small,
            y: startPosition.y / this._small
        };

        this._endPosition = {
            x: endPosition.x / this._small,
            y: endPosition.y / this._small
        };

        this._timeToMove = time;

        this._data.moveBy = {
            x: Math.abs(endPosition.x - startPosition.x) / (this._timeToMove / 1000 * 60),
            y: Math.abs(endPosition.y - startPosition.y) / (this._timeToMove / 1000 * 60)
        };

    };

    MovingPlatform.prototype = Object.create(Platform.prototype, {
        constructor: {
            value: MovingPlatform,
            writable: true,
            enumerable: false,
            configurable: true
        }
    });

    var _p = MovingPlatform.prototype;

    _p.update = function(){


        console.log(this._data.moveBy);
        //Platforms moves horizontally
        if(this._data.moveBy.x !== 0){
            this._sprite.position.x += this._data.moveBy.x;
            this._data.position.x += this._data.moveBy.x;

            if(this._startPosition.x < this._endPosition.x){

                if(this._data.position.x < this._startPosition.x || this._data.position.x > this._endPosition.x){
                    this._data.moveBy.x = - this._data.moveBy.x;
                }

            }
            else{

                if(this._data.position.x < this._endPosition.x || this._data.position.x > this._startPosition.x){
                    this._data.moveBy.x = - this._data.moveBy.x;
                }

            }
        }
        //Platforms moves vertically
        else{

            this._sprite.position.y += this._data.moveBy.y;
            this._data.position.y += this._data.moveBy.y;

            if(this._startPosition.y < this._endPosition.y){

                if(this._data.position.y < this._startPosition.y || this._data.position.y > this._endPosition.y){
                    this._data.moveBy.y = - this._data.moveBy.y;
                }

            }
            else{

                if(this._data.position.y < this._endPosition.y || this._data.position.y > this._startPosition.y){
                    this._data.moveBy.y = - this._data.moveBy.y;
                }

            }

        }

    };

    return MovingPlatform;

});