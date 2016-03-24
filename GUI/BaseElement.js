define([], function () {
	
	var BaseElement = function () {
		this._type = "";
	};
	
	BaseElement.prototype = {
		
		getType: function () {
			return this._type;
		}
		
	};
	
	return BaseElement;
	
 });