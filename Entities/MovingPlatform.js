import Platform from './Platform';

export default class MovingPlatform extends Platform {
    constructor (id, sprite, startPosition, endPosition, time) {
        super(id, sprite);
        this._smallScreenFactor = window.innerWidth <= 640 ? 2 : 1;
        this._isStatic = false;
        this._data.type = "MovingPlatform";
        this._data.movingSpeedFactor = 1;
        this._isPlatformMovingHorizontally = this._data.moveBy.x !== 0;

        this._startPosition = {
            x: startPosition.x / this._smallScreenFactor,
            y: startPosition.y / this._smallScreenFactor
        };

        this._endPosition = {
            x: endPosition.x / this._smallScreenFactor,
            y: endPosition.y / this._smallScreenFactor
        };

        this._timeToMove = time;

        this._data.moveBy = {
            x: Math.abs(endPosition.x - startPosition.x) / (this._timeToMove / 1000 * 60),
            y: Math.abs(endPosition.y - startPosition.y) / (this._timeToMove / 1000 * 60)
        };

    }

    reverseMovementDirection () {
        if (this._isPlatformMovingHorizontally) this._data.moveBy.x = - this._data.moveBy.x;
        else this._data.moveBy.y = - this._data.moveBy.y;
    }

    update () {
        if (this._isPlatformMovingHorizontally) {
            this._sprite.position.x += this._data.moveBy.x;
            this._data.position.x += this._data.moveBy.x;

            if (this._startPosition.x < this._endPosition.x) {
                if (this._data.position.x < this._startPosition.x || this._data.position.x > this._endPosition.x) {
                    this.reverseMovementDirection();
                }
            }
            else {
                if (this._data.position.x < this._endPosition.x || this._data.position.x > this._startPosition.x) {
                    this.reverseMovementDirection();
                }
            }
        }
        else {
            this._sprite.position.y += this._data.moveBy.y;
            this._data.position.y += this._data.moveBy.y;

            if (this._startPosition.y < this._endPosition.y) {
                if (this._data.position.y < this._startPosition.y || this._data.position.y > this._endPosition.y) {
                    this.reverseMovementDirection();
                }
            }
            else {
                if (this._data.position.y < this._endPosition.y || this._data.position.y > this._startPosition.y) {
                    this.reverseMovementDirection();
                }
            }
        }
    }

    static get Properties () {
        return {
            startPos: {
                subFields: [
                    {
                        name: "x",
                        type: "Number",
                        defaultValue: 0
                    },
                    {
                        name: "y",
                        type: "Number",
                        defaultValue: 0
                    }
                ],
                name: "Start position"
            },
            endPos: {
                subFields: [
                    {
                        name: "x",
                        type: "Number",
                        defaultValue: 0
                    },
                    {
                        name: "y",
                        type: "Number",
                        defaultValue: 0
                    }
                ],
                name: "End position"
            }
        };
    }
}
