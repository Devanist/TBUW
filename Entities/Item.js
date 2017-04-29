import Entity from './Entity';
    
class Item extends Entity{

    constructor(id, sprite) {
        super(id, sprite);
        this._data.type = "Item";
        this._data.inheritedTypes.push(this._data.type);
        this._isStatic = true;
    }

}

export default Item;