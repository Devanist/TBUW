import * as PIXI from 'pixi.js';
import { isSmallScreen } from '../Core/Utils/commonVars';

/**
 * Abstract class which is a base for GUI elements.
 * @class BaseElement
 * @abstract
 * @memberOf GUI
 * @param {String} id Unique name/identificator of element
 * @param {Point} position Screen position of element
 * @param {PIXI.Sprite} sprite Sprite for this element
 */
export default class BaseElement {
    constructor (id, position, sprite) {
        const isScreenSmall = isSmallScreen();
        this._sprite = new PIXI.Sprite(sprite);

        if (typeof(position) === "string") {
            if (position === "center") {
                this._sprite.position = isScreenSmall
                    ? {
                        x: window.innerWidth / 2 - this._sprite.width / 2, //eslint-disable-line no-magic-numbers
                        y: window.innerHeight / 2 - this._sprite.height /2 //eslint-disable-line no-magic-numbers
                    }
                    : {
                        x: (window.innerWidth / (window.innerHeight * 1.6 / 1280)) / 2 - this._sprite.width / 2, //eslint-disable-line no-magic-numbers
                        y: window.innerHeight / 2 - this._sprite.height / 2 //eslint-disable-line no-magic-numbers
                    };
            }
            else if (position === "bottom-right") {
                this._sprite.anchor.x = 1;
                this._sprite.anchor.y = 1;
                this._sprite.position = isScreenSmall
                    ? {
                        x: window.innerWidth,
                        y: window.innerHeight
                    }
                    : {
                        x: window.innerWidth / (window.innerHeight * 1.6 / 1280) + 4, //eslint-disable-line no-magic-numbers
                        y: 806 //window.innerHeight / this._sprite.scale.y
                    };
            }
            else if (position === "top-left") {
                this._sprite.position = {
                    x: 0,
                    y: 0
                };
            }
        }
        else {
            this._sprite.position = isScreenSmall
                ? {
                    x: position.x / 2, //eslint-disable-line no-magic-numbers
                    y: position.y / 2 //eslint-disable-line no-magic-numbers
                }
                : {
                    x: position.x,
                    y: position.y
                };
        }
        this._id = id;
        this._data = {
            enabled: false,
            active: false,
            position: {
                x: this._sprite.position.x,
                y: this._sprite.position.y
            },
            type: "",
            rotation: 0,
            currentRotationAngle: 0
        };
    }

    /**
     * Returns type of an element.
     * @function
     * @memberOf GUI.BaseElement
     * @returns {String}
     */
    getType () {
        return this._data.type;
    }

    /**
     * Returns ID of an element.
     * @function
     * @memberOf GUI.BaseElement
     * @returns {String}
     */
    getId () {
        return this._id;
    }

    display (b) {
        this._sprite.visible = b;
        return this;
    }

    /**
     * Returns main sprite of an element.
     * @function
     * @memberOf GUI.BaseElement
     * @returns {PIXI.Sprite}
     */
    getSprite () {
        return this._sprite;
    }

    /**
     * Method changes the position by specified vector.
     * @function
     * @memberOf GUI.BaseElement
     * @params {Vector} vec Vector by which element will be moved
     */
    move (vec) {
        this._sprite.position.x += vec.x;
        this._sprite.position.y += vec.y;
        this._data.position.x = this._sprite.position.x;
        this._data.position.y = this._sprite.position.y;
    }

    /**
     * Method sets the element's position to the specified one.
     * @function
     * @memberOf GUI.BaseElement
     * @param {Point} pos Position to which element will be moved
     */
    setPosition (pos) {
        if (pos.x) {
            this._sprite.position.x = pos.x;
            this._data.position.x = pos.x;
        }
        if (pos.y) {
            this._sprite.position.y = pos.y;
            this._data.position.y = pos.y;
        }
    }

    /**
     * Method sets the rotation angle of element.
     * @function
     * @memberOf GUI.BaseElement
     * @param {Number} val Value of angle
     */
    setRotationAngle (val) {
        this._data.rotation = val;
    }

    /**
     * Method that rotates element by given angle.
     * @function
     * @memberOf GUI.BaseElement
     * @param {Number} angle Value of angle to rotate
     */
    rotate (angle) {
        this._data.currentRotationAngle = angle;
        this._sprite.rotation = angle;
    }

    /**
     * Method that returns information if element can be interacted with.
     * @function
     * @memberOf GUI.BaseElement
     * @returns {Boolean}
     */
    isEnabled () {
        return this._data.enabled;
    }

    /**
     * Method that return information if element is selected.
     * @function
     * @memberOf GUI.BaseElement
     * @returns {Boolean}
     */
    isActive () {
        return this._data.active;
    }

    /**
     * Method that returns the position of element.
     * @function
     * @memberOf GUI.BaseElement
     * @returns {Point}
     */
    getPosition () {
        return this._data.position;
    }

    /**
     * Sets and anchor.
     * @function
     * @memberOf GUI.BaseElement
     */
    setAnchor (anchor) {
        this._sprite.anchor = anchor;
    }

}
