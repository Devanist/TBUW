import Item from './Item';

export default class Background extends Item {
    constructor (id, sprite, factor) {
        super(id, sprite);
        this._data.type = "Background";
        this._data.movingSpeedFactor = factor;
    };

    static get Properties () {
        return {
            factor: {
                name: "Factor",
                type: "Number",
                defaultValue: 1
            }
        }
    }
}
