define([
    'GUI/BaseElement'
], 
function(Base){
    
    var Label = function(id, position, text, style){
        Base.call(this, id, position, null);
        this._sprite = new PIXI.Text(text, style);
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
        this._data.text = text;
    };
    
    return Label;
    
});