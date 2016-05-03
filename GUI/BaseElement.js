define([], function () {
	
	var BaseElement = function (id, position, sprite) {
        this._sprite = new PIXI.Sprite(sprite);
        if(typeof(position) === "string"){
            if(position === "center"){
                position = {
                    x: window.innerWidth / 2 - this._sprite.width / 2,
                    y: window.innerHeight / 2 - this._sprite.height / 2
                };
            }
        }
        this._sprite.position = position;
        this._id = id;
        this._data = {
            position : position,
            type : "",
            rotation: 0,
            currentRotationAngle: 0
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
        },
        
        move: function(vec){
            this._sprite.position.x += vec.x;
            this._sprite.position.y += vec.y;
        },
        
        setPosition: function(pos){
            this._sprite.position.x = pos.x;
            this._sprite.position.y = pos.y;
        },
        
        setRotationAngle : function(val){
            this._data.rotation = val;
        },
        
        rotate : function(angle){
            this._data.currentRotationAngle = angle;
            this._sprite.rotation = angle;
        }
		
	};
	
	return BaseElement;
	
 });