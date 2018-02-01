const LEFT_TURNED = -1;
const RIGHT_TURNED = 1;

/**
 * Klasa reprezentująca wszystkie obiekty w grze.
 */
export default class Entity {
    constructor (id, texture) {
        this._id = id;
        this._isStatic = null;
        this._sprite = new PIXI.Sprite(texture);
        this._data = {
            id,
            direction: 1,
            size: {
                width: this._sprite.width,
                height: this._sprite.height
            },
            position: {
                x: 0,
                y: 0,
                endX: 0,
                endY: 0
            },
            offset: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            rotation: 0,
            currentRotationAngle: 0,
            type: "Entity",
            inheritedTypes: ["Entity"]
        };
    }

    /**
     * Metoda zwraca informację, czy obiekt może się poruszać.
     */
    isStatic () {
        return this._isStatic;
    }

    getId () {
        return this._data.id;
    }

    setPosition (pos) {
        this._sprite.position.x = pos.x;
        this._sprite.position.y = pos.y;
        this._data.position.x = pos.x;
        this._data.position.y = pos.y;
        this._data.position.endX = pos.x + this._data.size.width;
        this._data.position.endY = pos.y + this._data.size.height;
    }

    setAnchor (anchor) {
        this._sprite.anchor.x = anchor.x;
        this._sprite.anchor.y = anchor.y;
    }

    getPosition () {
        return this._sprite.position;
    }

    getSize () {
        return this._data.size;
    }

    updatePostion (pos) {
        this._sprite.position.x += pos.x;
        this._sprite.position.y += pos.y;
    }

    update () {
        const REVERSION_BREAKPOINT = 0;
        const ORIGINALLY_VIEWED = this._sprite.scale.x > REVERSION_BREAKPOINT;
        const REVERSED_VIEWED = this._sprite.scale.x < REVERSION_BREAKPOINT;

        if ( ORIGINALLY_VIEWED && this._data.direction === LEFT_TURNED) {
            this._sprite.scale.x *= this._data.direction;
            this._sprite.anchor.x = 1;
        }
        else if ( REVERSED_VIEWED && this._data.direction === RIGHT_TURNED) {
            this._sprite.scale.x *= -this._data.direction;
            this._sprite.anchor.x = 0;
        }
        this._sprite.position.x = this._data.position.x;
        this._sprite.position.y = this._data.position.y;
        if (this.d_BBox) {
            this.d_BBox.update(this._data.position, this._data.size);
            this.d_BBox.draw();
        }
    }

    getSprite () {
        return this._sprite;
    }

    debug_addBoundaryBox (bbox) {
        this.d_BBox = bbox;
        this._sprite.parent.addChild(bbox.getBox());
    }

    setRotationAngle (angle) {
        this._data.rotation = angle;
    }

    rotate (angle) {
        this._data.currentRotationAngle = angle;
        this._sprite.rotation = angle;
    }

    getType () {
        return this._data.type;
    }
}
