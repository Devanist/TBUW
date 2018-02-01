import BaseElement from './BaseElement';

export default class Image extends BaseElement {
    constructor (id, position, sprite) {
        super(id, position, sprite);
        this._data.type = "image";
    };

    static get Properties () {
        return {

        };
    }

}
