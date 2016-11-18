define(['GUI/BaseElement'], function(Base){

	/**
	 * Button for use in GUI. It can be used with or without sprite (just pass null as sprite parameter).
	 * @class Button
	 * @memberOf GUI
	 * @extends GUI.BaseElement
	 * @param {String} id Unique name of element
	 * @param {Point} position Position of button
	 * @param {PIXI.Sprite} sprite Sprite to display, can be null
	 * @param {String} text Text do display
	 * @param {Object} style Configuration object for styling button
	 * @param {Function} cb Callback to invoke when button activated
	 */
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
		if(text !== "" && style.size_override === false){
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
    
	/**
	 * Triggers a saved callback function.
	 * @function
	 * @memberOf GUI.Button
	 */
    _p.triggerCallback = function(){
        this._callback();
    };
	
	/**
	 * Sets the callback function to invoke when Button activated.
	 * @function
	 * @memberOf GUI.Button
	 * @param {Function} cb Function to invoke when activated
	 */
    _p.setCallback = function(cb){
        this._callback = cb;
		return this;
    };
    
	/**
	 * Returns the rectangle describing sprite of button.
	 * @function
	 * @memberOf GUI.Button
	 * @returns PIXI.Rectangle
	 */
    _p.getBounds = function(){
        return this._sprite.getLocalBounds();
    };
	
	/**
	 * Returns container that contain both sprite and text of a button.
	 * @function
	 * @memberOf GUI.Button
	 * @returns {PIXI.Container}
	 */
	_p.getSprite = function(){
		return this._container;
	};

	/**
	 * Moves the button by specified vector.
	 * @function
	 * @memberOf GUI.Button
	 * @param {Vector} vec Vector by which button will be moved
	 */
	_p.move = function(vec){
		this._sprite.position.x += vec.x;
		this._sprite.position.y += vec.y;
		this._data.position.x = this._sprite.position.x;
		this._data.position.y = this._sprite.position.y;
		this._text.position.x += vec.x;
		this._text.position.y += vec.y;
	};

	_p.display = function(b){
		this._container.visible = b;
		this._data.enabled = b;
		return this;
	};

	_p.active = function(b){
		this._data.active = b;
		return this;
	};
    
	return Button;

});