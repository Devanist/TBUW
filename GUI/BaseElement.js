define([], function () {
	
	var BaseElement = function (id, position) {
        this._sprite = null;
        this._id = id;
        this._data = {
            position : {
                x: position.x,
                y: position.y
            },
            type : ""
        };
	};
	
	BaseElement.prototype = {
		
		getType: function () {
			return this._data.type;
		},
        
        setSpriteSource : function(src){
            this._spriteSource = src;
        },
        
        init : function(){
            this._sprite = new PIXI.Sprite(this.__proto__.constructor._spriteSource);
            this._sprite.position = this._data.position;
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