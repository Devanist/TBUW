define([], function(){

/**
 * Klasa reprezentująca wszystkie obiekty w grze.
 */
var Entity = function(sprite){
    this._isStatic = null;
    this._sprite = new PIXI.Sprite(sprite);
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
    },
    
    getPosition : function(){
        return this._sprite.position;
    },
    
    updatePostion : function(pos){
        this._sprite.position.x += pos.x;
        this._sprite.position.y += pos.y;
    },
    
    setScale : function(scale){
        this._sprite.scale.x = scale.x;
        this._sprite.scale.y = scale.y;
    },
    
    getSprite : function(){
        return this._sprite;
    }
    
};

return Entity;
    
});