import Item from './Item';
import * as PIXI from 'pixi.js';

/**
 * Item that will cause lose when in touch with player.
 * @class
 * @memberOf Entities
 * @extends Entities.Item
 * @param {Number} id Unique identifier of element
 * @param {Array} sprites Sprites to use
 */
class Obstacle extends Item{

    constructor(id, sprites){
        super(id, null);
        this._data.type = "Obstacle";
        this._data.inheritedTypes.push(this._data.type);
        this._sprite = new PIXI.Container();
        for(let i = 0; i < sprites.length; i++){
            this._sprite.addChild(sprites[i]);
        }
        this._data.state = {
            collisionItems: []
        };
    }
    
    /**
     * This method should update the state field, that will be passed to the worker.
     * @abstract
     * @function
     * @memberOf Entities.Obstacle
     */
    update(){

    };

}


export default Obstacle;