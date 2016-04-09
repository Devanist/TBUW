define([], function () {
	
	var BaseElement = function (id, position, sprite) {
        this._sprite = new PIXI.Sprite(sprite);
        this._sprite.position = position;
        this._id = id;
        this._data = {
            position : position,
            type : ""
        };
	};
	
	BaseElement.prototype = {
		
		getType: function () {
			return this._data.type;
		},
        
        getId : function(){
            return this._id;
        },
        
        getSprite : function(){
            return this._sprite;
        }
		
	};
	
	return BaseElement;
	
 });