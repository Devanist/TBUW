import Item from './Item';

export default class Platform extends Item {
    constructor (id, sprite) {
        super(id, sprite);
        this._isStatic = true;
        this._data.type = "Platform";
        this._data.movingSpeedFactor = 1;
    };

}
