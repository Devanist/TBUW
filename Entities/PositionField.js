import Background from './Background';

const SAME_FACTOR_AS_PLAYER = 0;

const MAX_Y_DISPLACEMENT_SCALE = 6;
const MIN_Y_DISPLACEMENT_SCALE = 1;

const MAX_X_DISPLACEMENT_SCALE = 1.5;
const MIN_X_DISPLACEMENT_SCALE = 0.8;

const MAX_ALPHA = 0.8;
const MIN_ALPHA = 0.4;

function setUpDisplacementFilter () {
    const displacementMap = PIXI.Sprite.fromImage("Assets/Gfx/displacement_map_field.png");
    displacementMap.r = 1;
    displacementMap.g = 1;

    const displacement = new PIXI.filters.DisplacementFilter(displacementMap);
    displacement.scale.x = 0.8;
    displacement.scale.xoff = 0.02;
    displacement.scale.y = 2;
    displacement.scale.yoff = 0.08;

    return displacement;
}

export default class PositionField extends Background {
    constructor (id) {
        super(id, PIXI.loader.resources.sprites.textures["wcposition"], SAME_FACTOR_AS_PLAYER);
        this._data.type = "PositionField";
        this._sprite.alpha = 0.5;
        this._alphaoff = 0.01;
        this._displacement = setUpDisplacementFilter();

        this._sprite.filters = [this._displacement];
    }

    updateScale () {
        if (this._displacement.scale.y > MAX_Y_DISPLACEMENT_SCALE || this._displacement.scale.y <= MIN_Y_DISPLACEMENT_SCALE) {
            this._displacement.scale.yoff = -this._displacement.scale.yoff;
        }
        this._displacement.scale.y += this._displacement.scale.yoff;

        if (this._displacement.scale.x > MAX_X_DISPLACEMENT_SCALE || this._displacement.scale.x <= MIN_X_DISPLACEMENT_SCALE) {
            this._displacement.scale.xoff = -this._displacement.scale.xoff;
        }
        this._displacement.scale.x += this._displacement.scale.xoff;
    }

    updateTransparency () {
        if (this._sprite.alpha > MAX_ALPHA || this._sprite.alpha <= MIN_ALPHA) {
            this._alphaoff = -this._alphaoff;
        }
        this._sprite.alpha += this._alphaoff;
    }

    update () {
        this.updateScale();
        this.updateTransparency();
    }
}
