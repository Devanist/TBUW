import BlockCoinCurrency from '../Currencies/BlockCoin';
import Collectible from './Collectible';

const COLLECT_ANIMATION_STEPS = 15;

export default class BlockCoin extends Collectible {
    constructor (id, quantity, position) {
        super(id, PIXI.loader.resources.sprites.textures["blockcoin"], position);
        this._currency = new BlockCoinCurrency();
        this._currency.setQuantity(quantity);
        this._data.type = "BlockCoin";
        this._data.rotation = 0.1;
        this._data.collected = false;
    }

    collect () {
        if (!this._data.collected) {
            const q = Collectible.prototype.collect.call(this);
            this._data.collected = true;
            this._data.originPosition = {
                x: this._sprite.position.x,
                y: this._sprite.position.y
            };
            return q;
        }
        return {quantity: 0, name: "BlockCoin"};
    }

    moveToContainerIfCollected () {
        if (!this._data.collected) return;

        const destination = {
            x: -this._sprite.parent.position.x + 140, // eslint-disable-line no-magic-numbers
            y: -this._sprite.parent.position.y + 40 // eslint-disable-line no-magic-numbers
        };

        var step = {
            x: (destination.x - this._data.originPosition.x) / COLLECT_ANIMATION_STEPS,
            y: (destination.y - this._data.originPosition.y) / COLLECT_ANIMATION_STEPS
        };

        this._data.position.x += step.x;
        this._data.position.y += step.y;
        this._sprite.position.x = this._data.position.x;
        this._sprite.position.y = this._data.position.y;

        if (this._data.position.x < destination.x && this._data.position.y < destination.y) {
            this._data.toBeRemoved = true;
        }
    }

    update () {
        this.moveToContainerIfCollected();
    }

    static get Properties () {
        return {
            quantity: {
                name: "Quantity",
                type: "Number",
                defaultValue: 1
            }
        }
    }
}
