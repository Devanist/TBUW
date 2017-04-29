import Background from './Background';

class PositionField extends Background{

    constructor(id){
        super(id, PIXI.loader.resources.sprites.textures["wcposition"], 0);
        this._data.type = "PositionField";
        this.displacementMap = PIXI.Sprite.fromImage("Assets/Gfx/displacement_map_field.png");
        
        this.displacementMap.r = 1;
        this.displacementMap.g = 1;
        this._sprite.alpha = 0.5;
        this._alphaoff = 0.01; 

        this._displacement = new PIXI.filters.DisplacementFilter(this.displacementMap);

        this._displacement.scale.x = 0.8;
        this._displacement.scale.xoff = 0.02;
        this._displacement.scale.y = 2;
        this._displacement.scale.yoff = 0.08;

        this._sprite.filters = [this._displacement];
    }

    update(){
        if(this._displacement.scale.y > 6 || this._displacement.scale.y <= 1){
            this._displacement.scale.yoff = -this._displacement.scale.yoff;
        }
        this._displacement.scale.y += this._displacement.scale.yoff;        

        if(this._displacement.scale.x > 1.5 || this._displacement.scale.x <= 0.8){
            this._displacement.scale.xoff = -this._displacement.scale.xoff;
        }
        this._displacement.scale.x += this._displacement.scale.xoff;

        if(this._sprite.alpha > 0.8 || this._sprite.alpha <= 0.4){
            this._alphaoff = -this._alphaoff;
        }
        this._sprite.alpha += this._alphaoff;
    }

}

export default PositionField;