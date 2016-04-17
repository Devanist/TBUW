define([], function(){
    
    /**
     * Showing boundary boxes of sprites.
     */
    var BoundaryBox = function(position, size){
        
        this._box = new PIXI.Graphics();
        this._box.lineStyle(1, 0x00F600);
        this._data = {
            position: {
                x: position.x,
                y: position.y
            },
            size: {
                w: size.w,
                h: size.h
            }
        };
        
    };
    
    BoundaryBox.prototype = {
        
        update : function(position, size){
            this._data = {
                position: {
                    x: position.x,
                    y: position.y
                },
                size: {
                    w: size.w,
                    h: size.h
                }
            };
        },
        
        draw : function(){
            this._box.clear();
            this._box.lineStyle(1, 0x00F600);
            this._box.drawRect(this._data.position.x, this._data.position.y, this._data.size.w, this._data.size.h);
        },
        
        getBox : function(){
            return this._box;
        }
        
    };
    
    return BoundaryBox;
    
});