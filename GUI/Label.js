import BaseElement from './BaseElement';
import { isSmallScreen } from '../Core/Utils/commonVars';

export default class Label extends BaseElement {
    constructor (id, position, text, style = {}) {
        super(id, position, null);
        if (style.bitmap) {
            style.font = {
                size: style.fontSize,
                name: style.fontFamily
            };
            this._sprite = new PIXI.extras.BitmapText(text, style);
            this._sprite.containsPoint = function (pos) {
                return ( pos.x >= this.position.x &&
                    pos.x <= this.position.x + this.textWidth &&
                    pos.y >= this.position.y &&
                    pos.y <= this.position.y + this.textHeight);
            };
        }
        else {
            this._sprite = new PIXI.Text(text, style);
            this._sprite.anchor.x = 0.5;
            this._sprite.anchor.y = 0.5;
        }
        if (typeof(position) === "string") {
            let elementPosition;
            if (position === "center") {
                elementPosition = isSmallScreen()
                    ? {
                        x: window.innerWidth / 2 - this._sprite.width / 2, // eslint-disable-line no-magic-numbers
                        y: window.innerHeight / 2 - this._sprite.height /2 // eslint-disable-line no-magic-numbers
                    }
                    : {
                        x: (window.innerWidth / (window.innerHeight * 1.6 / 1280)) / 2 - this._sprite.width / 2, // eslint-disable-line no-magic-numbers
                        y: window.innerHeight / 2 - this._sprite.height / 2 // eslint-disable-line no-magic-numbers
                    };
            }
            this._sprite.position = elementPosition;
            this._data.position = elementPosition;
        }
        else {
            if (isSmallScreen()) {
                this._sprite.position = {
                    x: position.x / 2, // eslint-disable-line no-magic-numbers
                    y: position.y / 2 // eslint-disable-line no-magic-numbers
                };
                this._data.position = {
                    x: position.x / 2, // eslint-disable-line no-magic-numbers
                    y: position.y / 2 // eslint-disable-line no-magic-numbers
                };
            }
            else {
                this._sprite.position = {
                    x: position.x,
                    y: position.y
                };
                this._data.position = {
                    x: position.x,
                    y: position.y
                };
            }
        }
    }

    setText (text) {
        this._sprite.text = text;
    }

    static get Properties () {
        return {
            text: {
                name: "Text",
                type: "Text",
                defaultValue: "Default text"
            },
            options: {
                name: "Options",
                subFields: [
                    {
                        label: "Is bitmap",
                        name: "bitmap",
                        type: "Boolean",
                        defaultValue: false,
                    },
                    {
                        label: "Font size",
                        name: "fontSize",
                        type: "Number",
                        defaultValue: "14"
                    },
                    {
                        label: "Font family",
                        name: "fontFamily",
                        type: "Text",
                        defaultValue: "Arial"
                    },
                    {
                        label: "Fill color",
                        name: "fill",
                        type: "Text",
                        defaultValue: "0xffffff"
                    },
                    {
                        label: "Text align",
                        name: "align",
                        type: "Text",
                        defaultValue: "center"
                    }
                ]
            }
        };
    }
}
