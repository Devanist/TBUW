define(['Entities/Item'], function(Item){

    /**
     * Item that will cause lose when in touch with player.
     * @class
     * @memberOf Entities
     * @extends Entities.Item
     * @param {Number} id Unique identifier of element
     * @param {Array} sprites Sprites to use
     */
    var Obstacle = function(id, sprites){
        Item.call(this, id, null);
        this._data.type = "Obstacle";
        this._data.inheritedTypes.push(this._data.type);
        this._sprite = new PIXI.Container();
        for(let i = 0; i < sprites.length; i++){
            this._sprite.addChild(sprites[i]);
        }
        this._data.state = {
            collisionItems: []
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

    /**
     * This method should update the state field, that will be passed to the worker.
     * @abstract
     * @function
     * @memberOf Entities.Obstacle
     */
    _p.update = function(){

    };

    return Obstacle;

});