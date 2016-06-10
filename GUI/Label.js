define([
    'GUI/BaseElement'
], 
function(Base){
    
    var Label = function(id, position, text, style){
        style = style || {};
        Base.call(this, id, position, null);
        if(style.bitmap){
			this._sprite = new PIXI.extras.BitmapText(text, style);
		}
		else{
			this._sprite = new PIXI.Text(text, style);
			this._sprite.anchor.x = 0.5;
			this._sprite.anchor.y = 0.5;
		}
        if(typeof(position) === "string"){
            if(position === "center"){
                position = {
                    x: window.innerWidth / 2 - this._sprite.width / 2,
                    y: window.innerHeight / 2 - this._sprite.height / 2
                };
            }
        }
        this._sprite.position = position;
        this._data.position = position;
    };
    
    Label.prototype = Object.create(Base.prototype, {
        constructor: {
            value: Label,
            enumerable: false,
            configurable: true,
            writable: true
        }
    });
    
    _p = Label.prototype;
    
    _p.setText = function(text){
        this._sprite.text = text;
    };
    
    return Label;
    
});