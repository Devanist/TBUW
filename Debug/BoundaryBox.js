/**
 * Showing boundary boxes of sprites.
 */
class BoundaryBox{

    constructor(position, size, anchor){   
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
        if(anchor){
            this._data.anchor = {
                x: anchor.x,
                y: anchor.y
            };
        }
        
    }

    update(position, size){
        if(this._data.anchor === undefined){
            this._data.position.x = position.x;
            this._data.position.y = position.y;
        }
        else{
            this._data.position.x = position.x - size.w * this._data.anchor.x;
            this._data.position.y = position.y - size.h * this._data.anchor.y;
        }
        
        this._data.size.w = size.w;
        this._data.size.h = size.h;
    }
    
    draw(){
        this._box.clear();
        this._box.lineStyle(1, 0x00F600);
        this._box.drawRect(this._data.position.x, this._data.position.y, this._data.size.w, this._data.size.h);
    }
    
    getBox(){
        return this._box;
    }

}

export default BoundaryBox;