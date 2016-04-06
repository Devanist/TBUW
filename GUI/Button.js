define(['GUI/BaseElement'], function(Base){

	var Button = function(id, position, cb){
		Base.call(this, id, position);
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
	
	return Button;

});