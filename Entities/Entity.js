define([], function(){

/**
 * Klasa reprezentująca wszystkie obiekty w grze.
 */
var Entity = function(sprite){
    this._isStatic = null;
    this._sprite = new PIXI.Sprite(sprite);
    this._data = {        
        direction: 1,
        size: {
            w: this._sprite.getBounds().width,
            h: this._sprite.getBounds().height
        },
        position: {
            x: 0,
            y: 0,
            endX: 0,
            endY: 0
        },
        offset: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        },
        rotation: 0,
        currentRotationAngle: 0
    };
};

Entity.prototype = {
    
    /**
     * Metoda zwraca informację, czy obiekt może się poruszać.
     */
    isStatic : function(){
        return this._isStatic;
    },
    
    setPosition : function(pos){
        this._sprite.position.x = pos.x;
        this._sprite.position.y = pos.y;
        this._data.position.x = pos.x;
        this._data.position.y = pos.y;
        this._data.position.endX = pos.x + this._data.size.w;
        this._data.position.endY = pos.y + this._data.size.h;
    },
    
    getPosition : function(){
        return this._sprite.position;
    },
    
    getSize : function(){
        return this._data.size;
    },
    
    updatePostion : function(pos){
        this._sprite.position.x += pos.x;
        this._sprite.position.y += pos.y;
    },
    
    update : function (){
        if(this._sprite.scale.x > 0 && this._data.direction === -1){
            this._sprite.scale.x *= this._data.direction;
            this._sprite.anchor.x = 1;
        }
        if(this._sprite.scale.x < 0 && this._data.direction === 1){
            this._sprite.scale.x *= -this._data.direction;
            this._sprite.anchor.x = 0;
        }
        this._sprite.position.x = this._data.position.x;
        this._sprite.position.y = this._data.position.y;
        
        if(this.d_BBox !== undefined && this.d_BBox !== null){
            this.d_BBox.update(this._data.position, this._data.size);
            this.d_BBox.draw();
        }
        
    },
    
    getSprite : function(){
        return this._sprite;
    },
    
    debug_addBoundaryBox : function(bbox){
        this.d_BBox = bbox;
        this._sprite.parent.addChild(this.d_BBox.getBox());
    },
    
    setRotationAngle : function(val){
        this._data.rotation = val;
    },
    
    rotate : function(angle){
        this._data.currentRotationAngle = angle;
        this._sprite.rotation = angle;
    }
    
};

return Entity;
    
});