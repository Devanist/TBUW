define(['Entities/Obstacle'], function(Obstacle){

    /**
     * Object that fires missiles. When missiles are in contact with player, he loses.
     * @class
     * @memberOf Entities
     * @extends Entities.Obstacle
     * @param {Number} id Unique identifier of element
     */
    var LasersFromGround = function(id){
        this._firstGround = new PIXI.Sprite.fromFrame("lazor_00000");
        this._lazorOne = new PIXI.Sprite.fromFrame("lazor");
        this._lazorOne.position.x += 24;
        this._lazorTwo = new PIXI.Sprite.fromFrame("lazor");
        this._lazorTwo.position.x += 45;
        this._lazorThree = new PIXI.Sprite.fromFrame("lazor");
        this._lazorThree.position.x += 80;
        this._ground = new PIXI.Sprite.fromFrame("lazor_up");

        this._lazorOne.position.y += 26;
        this._lazorTwo.position.y += 60;
        this._lazorThree.position.y += 40;

        this._lazors = [this._lazorOne, this._lazorTwo, this._lazorThree];

        Obstacle.call(this, id, [
            this._firstGround,
            this._lazorOne,
            this._lazorTwo,
            this._lazorThree,
            this._ground
        ]);
        this._data.maxHeight = 380;
        this._data.type = "LasersFromGround";
        this._data.inheritedTypes.push(this._data.type);
        this._data.animationSpeed = -10;
        this._data.state.collisionItems = [
            {
                initialPosition: {
                    x: this._lazorOne.position.x,
                    y: this._lazorOne.position.y,
                    ex: this._lazorOne.position.x + this._lazorOne.width,
                    ey: this._lazorOne.position.y + this._lazorOne.height
                },
                currentPosition: {
                    x: this._lazorOne.position.x,
                    y: this._lazorOne.position.y,
                    ex: this._lazorOne.position.x + this._lazorOne.width,
                    ey: this._lazorOne.position.y + this._lazorOne.height
                }
            },
            {
                initialPosition: {
                    x: this._lazorTwo.position.x,
                    y: this._lazorTwo.position.y,
                    ex: this._lazorTwo.position.x + this._lazorTwo.width,
                    ey: this._lazorTwo.position.y + this._lazorTwo.height
                },
                currentPosition:{
                    x: this._lazorTwo.position.x,
                    y: this._lazorTwo.position.y,
                    ex: this._lazorTwo.position.x + this._lazorTwo.width,
                    ey: this._lazorTwo.position.y + this._lazorTwo.height
                }
            },
            {
                initialPosition:{
                    x: this._lazorThree.position.x,
                    y: this._lazorThree.position.y,
                    ex: this._lazorThree.position.x + this._lazorThree.width,
                    ey: this._lazorThree.position.y + this._lazorThree.height
                },
                currentPosition:{
                    x: this._lazorThree.position.x,
                    y: this._lazorThree.position.y,
                    ex: this._lazorThree.position.x + this._lazorThree.width,
                    ey: this._lazorThree.position.y + this._lazorThree.height
                }
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

        for(let i = 0; i < this._data.state.collisionItems.length; i++){
            this._lazors[i].position.x = this._data.state.collisionItems[i].currentPosition.x;
            this._lazors[i].position.y = this._data.state.collisionItems[i].currentPosition.y;
        }

    };

    _p.setAnchor = function(anchor){

    };

    return LasersFromGround;

});