import Entity from './Entity';

export default class Item extends Entity {
    constructor (id, sprite) {
        super(id, sprite);
        this._data.type = "Item";
        this._data.inheritedTypes.push(this._data.type);
        this._isStatic = true;
    }

}
