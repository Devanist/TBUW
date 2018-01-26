import Entity from './Entity';

export default class Creature extends Entity {
    constructor (id, sprite) {
        super(id, sprite);
        this._isStatic = false;
        this._data.velocity = {
            x: 0,
            y: 0
        };
    };

    getId () {
        return this._id;
    };

    getVelocity () {
        return this._velocity;
    }

}
