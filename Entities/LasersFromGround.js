define(['Entities/Obstacle'], function(Obstacle){

    /**
     * @class
     * @memberOf Entities
     * @extends Entities.Obstacle
     */
    var LasersFromGround = function(id){
        this._maxHeight = 320;
        this._lazorOne = new PIXI.Sprite.fromFrame("lazor");
        this._lazorOne.position.x += 24;
        this._lazorTwo = new PIXI.Sprite.fromFrame("lazor");
        this._lazorTwo.position.x += 45;
        this._lazorThree = new PIXI.Sprite.fromFrame("lazor");
        this._lazorThree.position.x += 80;
        this._ground = new PIXI.Sprite.fromFrame("lazor_00000");
        this._lazorsY = {
            first: this._lazorOne.position.y,
            second: this._lazorTwo.position.y,
            third: this._lazorThree.position.y
        };
        this._lazorOne.position.y += 290;
        this._lazorTwo.position.y += 327;
        this._lazorThree.position.y += 300;

        Obstacle.call(this, id, [
            this._lazorOne,
            this._lazorTwo,
            this._lazorThree,
            this._ground
        ]);
        this._data.state.collisionItems = [
            {
                x: this._lazorOne.position.x,
                y: this._lazorOne.position.y,
                ex: this._lazorOne.position.x + this._lazorOne.width,
                ey: this._lazorOne.position.y + this._lazorOne.height
            },
            {
                x: this._lazorTwo.position.x,
                y: this._lazorTwo.position.y,
                ex: this._lazorTwo.position.x + this._lazorTwo.width,
                ey: this._lazorTwo.position.y + this._lazorTwo.height
            },
            {
                x: this._lazorThree.position.x,
                y: this._lazorThree.position.y,
                ex: this._lazorThree.position.x + this._lazorThree.width,
                ey: this._lazorThree.position.y + this._lazorThree.height
            },
        ];
    };

    LasersFromGround.prototype = Object.create(Obstacle.prototype, {
        constructor: {
            value: LasersFromGround,
            enumerable: false,
            configurable: true,
            writable: true
        }
    });

    var _p = LasersFromGround.prototype;

    /**
     * This method will update the state field, that will be passed to worker.
     * @function
     * @memberOf Entities.LasersFromGround
     */
    _p.update = function(){

        this._data.state.collisionItems = [
            {
                x: this._lazorOne.position.x,
                y: this._lazorOne.position.y,
                ex: this._lazorOne.position.x + this._lazorOne.width,
                ey: this._lazorOne.position.y + this._lazorOne.height
            },
            {
                x: this._lazorTwo.position.x,
                y: this._lazorTwo.position.y,
                ex: this._lazorTwo.position.x + this._lazorTwo.width,
                ey: this._lazorTwo.position.y + this._lazorTwo.height
            },
            {
                x: this._lazorThree.position.x,
                y: this._lazorThree.position.y,
                ex: this._lazorThree.position.x + this._lazorThree.width,
                ey: this._lazorThree.position.y + this._lazorThree.height
            },
        ];

    };

    return LasersFromGround;

});