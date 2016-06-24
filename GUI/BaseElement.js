define([], function () {
	
	var BaseElement = function (id, position, sprite) {
        this._sprite = new PIXI.Sprite(sprite);
        if(typeof(position) === "string"){
            console.log(PIXI);
            if(position === "center"){
                position = {
                    x: window.innerWidth / 2 - this._sprite.width / 2,
                    y: window.innerHeight / 2 - this._sprite.height / 2
                };
            }
            else if(position === "bottom-right"){
                position = {
                    x: window.innerWidth,
                    y: window.innerHeight
                };
            }
        }
        this._sprite.position = position;
        this._id = id;
        this._data = {
            enabled: false,
            active: false,
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
            this._data.position.x = this._sprite.position.x;
            this._data.position.y = this._sprite.position.y;
        },
        
        setPosition: function(pos){
            this._sprite.position.x = pos.x;
            this._sprite.position.y = pos.y;
            this._data.position.x = pos.x;
            this._data.position.y = pos.y;
        },
        
        setRotationAngle : function(val){
            this._data.rotation = val;
        },
        
        rotate : function(angle){
            this._data.currentRotationAngle = angle;
            this._sprite.rotation = angle;
        },
        
        isEnabled : function(){
            return this._data.enabled;
        },
        
        isActive : function(){
            return this._data.active;
        },
        
        getPosition : function(){
            return this._data.position;
        }
		
	};
	
	return BaseElement;
	
 });