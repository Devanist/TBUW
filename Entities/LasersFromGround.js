import Obstacle from './Obstacle';

/**
 * Object that fires missiles. When missiles are in contact with player, he loses.
 * @class
 * @memberOf Entities
 * @extends Entities.Obstacle
 * @param {Number} id Unique identifier of element
 */
class LasersFromGround extends Obstacle{

    constructor(id){
        let small = 1;
        if(window.innerWidth <= 640){
            small = 2;
        }
        let firstGround = new PIXI.Sprite(PIXI.loader.resources.sprites.textures["lazor_00000"]);
        let lazorOne = new PIXI.Sprite(PIXI.loader.resources.sprites.textures["lazor"]);
        lazorOne.position.x += 24 / small;
        let lazorTwo = new PIXI.Sprite(PIXI.loader.resources.sprites.textures["lazor"]);
        lazorTwo.position.x += 45 / small;
        let lazorThree = new PIXI.Sprite(PIXI.loader.resources.sprites.textures["lazor"]);
        lazorThree.position.x += 80 / small;
        let ground = new PIXI.Sprite(PIXI.loader.resources.sprites.textures["lazor_up"]);

        lazorOne.position.y += 26 / small;
        lazorTwo.position.y += 60 / small;
        lazorThree.position.y += 40 / small;

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
        this._data.maxHeight = 380 / small;
        this._data.type = "LasersFromGround";
        this._data.inheritedTypes.push(this._data.type);
        this._data.animationSpeed = -10 / small;
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
    }

    /**
     * This method will update the state field, that will be passed to worker.
     * @function
     * @memberOf Entities.LasersFromGround
     */
    update(){

        for(let i = 0; i < this._data.state.collisionItems.length; i++){
            this._lazors[i].position.x = this._data.state.collisionItems[i].currentPosition.x;
            this._lazors[i].position.y = this._data.state.collisionItems[i].currentPosition.y;
        }

    }

    setAnchor(anchor){

    };

}

export default LasersFromGround;