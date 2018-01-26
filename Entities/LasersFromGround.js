import Obstacle from './Obstacle';

/**
 * Object that fires missiles. When missiles are in contact with player, he loses.
 * @class
 * @memberOf Entities
 * @extends Entities.Obstacle
 * @param {Number} id Unique identifier of element
 */
export default class LasersFromGround extends Obstacle {
    constructor (id) {
        const smallScreenFactor = window.innerWidth <= 640 ? 2 : 1;

        const firstGround = new PIXI.Sprite(PIXI.loader.resources.sprites.textures["lazor_00000"]);
        const lazorOne = new PIXI.Sprite(PIXI.loader.resources.sprites.textures["lazor"]);
        lazorOne.position.x += 24 / smallScreenFactor;
        const lazorTwo = new PIXI.Sprite(PIXI.loader.resources.sprites.textures["lazor"]);
        lazorTwo.position.x += 45 / smallScreenFactor;
        const lazorThree = new PIXI.Sprite(PIXI.loader.resources.sprites.textures["lazor"]);
        lazorThree.position.x += 80 / smallScreenFactor;
        const ground = new PIXI.Sprite(PIXI.loader.resources.sprites.textures["lazor_up"]);

        lazorOne.position.y += 26 / smallScreenFactor;
        lazorTwo.position.y += 60 / smallScreenFactor;
        lazorThree.position.y += 40 / smallScreenFactor;

        super(id, [
            firstGround,
            lazorOne,
            lazorTwo,
            lazorThree,
            ground
        ]);

        this._firstGround = firstGround;
        this._lazorOne = lazorOne;
        this._lazorTwo = lazorTwo;
        this._lazorThree =lazorThree;
        this._ground = ground;

        this._lazors = [this._lazorOne, this._lazorTwo, this._lazorThree];
        this._data.maxHeight = 380 / smallScreenFactor;
        this._data.type = "LasersFromGround";
        this._data.inheritedTypes.push(this._data.type);
        this._data.animationSpeed = -10 / smallScreenFactor;
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
                currentPosition: {
                    x: this._lazorTwo.position.x,
                    y: this._lazorTwo.position.y,
                    ex: this._lazorTwo.position.x + this._lazorTwo.width,
                    ey: this._lazorTwo.position.y + this._lazorTwo.height
                }
            },
            {
                initialPosition: {
                    x: this._lazorThree.position.x,
                    y: this._lazorThree.position.y,
                    ex: this._lazorThree.position.x + this._lazorThree.width,
                    ey: this._lazorThree.position.y + this._lazorThree.height
                },
                currentPosition: {
                    x: this._lazorThree.position.x,
                    y: this._lazorThree.position.y,
                    ex: this._lazorThree.position.x + this._lazorThree.width,
                    ey: this._lazorThree.position.y + this._lazorThree.height
                }
            },
        ];
    }

    /**
     * This method will update the state field, that will be passed to worker.
     * @function
     * @memberOf Entities.LasersFromGround
     */
    update () {
        this._data.state.collisionItems.forEach((collisionItem, index) => {
            const { position: lazorPosition} = this._lazors[index];

            lazorPosition.x = collisionItem.currentPosition.x;
            lazorPosition.y = collisionItem.currentPosition.y;
        });
    }
}
