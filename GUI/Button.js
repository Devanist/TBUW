define(['GUI/BaseElement'], function(Base){

	var Button = function(id, position, sprite, cb){
		Base.call(this, id, position, sprite);
        this._data.type = "button";
		this._callback = cb;
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
    
	return Button;

});