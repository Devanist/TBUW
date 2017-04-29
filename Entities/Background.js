import Item from './Item';

class Background extends Item{

    constructor(id, sprite, factor){
        super(id, sprite);
        this._data.type = "Background";
        this._data.movingSpeedFactor = factor;
    };

}

export default Background;