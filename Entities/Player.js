import Creature from './Creature';
import Currencies from '../Currencies/Currencies';

const FIRST_FRAME = 0;

export default class Player extends Creature {
    constructor (id, frames) {
        super(id, frames[FIRST_FRAME]);
        this._frames = frames;
        this._data.type = "Player";
        this._data.state = {
            inAir: false,
            doubleJumped: false,
            canDoubleJump: false,
            moving: 0
        };
        this._data.offset.y = 3;
        this._data.offset.width = -3;
        this._data.offset.height = -11;
        this._data.position.endY = this._data.position.y + this._data.size.height;
        this._currencies = new Currencies();
    };

    collectCurrency (currency) {
        this._currencies.addQuantity(currency);
    };

    nextFrame (frame) {
        this._sprite.texture = this._frames[frame];
    };
}
