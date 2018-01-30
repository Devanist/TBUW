const BOUNDARY_LINE_WIDTH_IN_PIXELS = 1;
const BOUNDARY_LINE_COLOR = 0x00F600;

/**
 * Showing boundary boxes of sprites.
 */
export default class BoundaryBox {
    constructor (position, size, anchor) {
        this._box = new PIXI.Graphics();
        this._box.lineStyle(BOUNDARY_LINE_WIDTH_IN_PIXELS, BOUNDARY_LINE_COLOR);
        this._data = {
            position: {
                x: position.x,
                y: position.y
            },
            size: {
                width: size.width,
                height: size.height
            }
        };
        if (anchor) {
            this._data.anchor = {
                x: anchor.x,
                y: anchor.y
            };
        }
    }

    update (position, size) {
        if (this._data.anchor === undefined) {
            this._data.position.x = position.x;
            this._data.position.y = position.y;
        }
        else {
            this._data.position.x = position.x - size.width * this._data.anchor.x;
            this._data.position.y = position.y - size.height * this._data.anchor.y;
        }

        this._data.size.width = size.width;
        this._data.size.height = size.height;
    }

    draw () {
        this._box.clear();
        this._box.lineStyle(BOUNDARY_LINE_WIDTH_IN_PIXELS, BOUNDARY_LINE_COLOR);
        this._box.drawRect(this._data.position.x, this._data.position.y, this._data.size.width, this._data.size.height);
    }

    getBox () {
        return this._box;
    }
}
