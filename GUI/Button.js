define(['GUI/BaseElement'], function(Base){

	var Button = function(id, position, sprite, text, style, cb){
		Base.call(this, id, position, sprite);
        this._data.type = "button";
		this._data.enabled = true;
		this._data.active = style.active || false;
		this._callback = cb;
		this._container = new PIXI.Container();
		this._container.addChild(this._sprite);
		if(style.bitmap){
			this._text = new PIXI.extras.BitmapText(text, style);
			this._text.position.x = this._sprite.position.x - this._text.width / 2;
			this._text.position.y = this._sprite.position.y - this._text.height / 2;
		}
		else{
			this._text = new PIXI.Text(text, style);
			this._text.anchor.x = 0.5;
			this._text.anchor.y = 0.5;
			this._text.position = position;
		}
		this._container.addChild(this._text);
		this._sprite.anchor.x = 0.5;
		this._sprite.anchor.y = 0.5;
		if(text !== ""){
			this._sprite.width = this._text.width + 20;
			this._sprite.height = this._text.height + 20;
		}
	};
	
	Button.prototype = Object.create(Base.prototype, {
		constructor: {
			value: Button,
			writable: true,
			configurable: true,
			enumerable: false
		}
	});
    
    var _p = Button.prototype;
    
    _p.triggerCallback = function(){
        this._callback();
    };
	
    _p.setCallback = function(cb){
        this._callback = cb;
    };
    
    _p.getBounds = function(){
        return this._sprite.getLocalBounds();
    };
	
	_p.getSprite = function(){
		return this._container;
	};

	_p.move = function(vec){
		this._sprite.position.x += vec.x;
		this._sprite.position.y += vec.y;
		this._data.position.x = this._sprite.position.x;
		this._data.position.y = this._sprite.position.y;
		this._text.position.x += vec.x;
		this._text.position.y += vec.y;
	};
    
	return Button;

});