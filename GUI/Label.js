import BaseElement from './BaseElement';
    
class Label extends BaseElement{

    constructor(id, position, text, style){
        style = style || {};
        super(id, position, null);
        if(style.bitmap){
            this._sprite = new PIXI.extras.BitmapText(text, style);
            this._sprite.containsPoint = function(pos){
                if( pos.x >= this.position.x &&
                    pos.x <= this.position.x + this.textWidth &&
                    pos.y >= this.position.y &&
                    pos.y <= this.position.y + this.textHeight){
                        return true;
                }
                return false;

            };
        }
        else{
            this._sprite = new PIXI.Text(text, style);
            this._sprite.anchor.x = 0.5;
            this._sprite.anchor.y = 0.5;
        }
        if(typeof(position) === "string"){
            if(position === "center"){
                if(window.innerWidth <= 640){
                    position = {
                        x: window.innerWidth / 2 - this._sprite.width / 2,
                        y: window.innerHeight / 2 - this._sprite.height /2
                    };
                }
                else{
                    position = {
                        x: (window.innerWidth / (window.innerHeight * 1.6 / 1280)) / 2 - this._sprite.width / 2,
                        y: window.innerHeight / 2 - this._sprite.height / 2
                    };
                }
            }
            this._sprite.position = position;
            this._data.position = position;
        }
        else{
            if(window.innerWidth <= 640){
                this._sprite.position = {
                    x: position.x / 2,
                    y: position.y / 2
                };
                this._data.position = {
                    x: position.x / 2,
                    y: position.y / 2
                };
            }
            else{
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
    
    setText(text){
        this._sprite.text = text;
    }

    static get Properties(){
        return {
            text : {
                name : "Text",
                type : "Text",
                defaultValue : "Default text"
            },
            options : {
				name : "Options",
				subFields : [
					{
						label : "Is bitmap",
						name : "bitmap",
						type : "Boolean",
						defaultValue : false,
					},
					{
						label : "Font size",
						name : "fontSize",
						type : "Number",
						defaultValue : "14"
					},
					{
						label : "Font family",
						name : "fontFamily",
						type : "Text",
						defaultValue : "Arial"
					},
					{
						label : "Fill color",
						name : "fill",
						type : "Text",
						defaultValue : "0xffffff"
					},
					{
						label : "Text align",
						name : "align",
						type : "Text",
						defaultValue : "center"
					}
				]
			}
        };
    }

}


export default Label;