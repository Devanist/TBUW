define([], function(){

/**
 * Klasa reprezentująca wszystkie obiekty w grze.
 */
var Entity = function(sprite){
    this._isStatic = null;
    this._sprite = new PIXI.Sprite(sprite);
    this._data = {
        position: {x: 0, y: 0},
        size: {w: 0, h: 0}
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
    },
    
    getPosition : function(){
        return this._sprite.position;
    },
    
    updatePostion : function(pos){
        this._sprite.position.x += pos.x;
        this._sprite.position.y += pos.y;
    },
    
    update : function (){
        this._sprite.position.x = this._data.position.x;
        this._sprite.position.y = this._data.position.y;
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