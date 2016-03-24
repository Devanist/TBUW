define(['GUI/BaseElement'], function(Base){

	var Button = function(cb){
		Base.call(this);
		this._type = "button";
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
	
	return Button;

});