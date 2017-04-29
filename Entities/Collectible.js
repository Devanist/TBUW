import Entity from './Entity';

class Collectible extends Entity{

    constructor(id, sprite){
        super(id, sprite);
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 0.5;
        this._data.anchor = {
            x: this._sprite.anchor._x,
            y: this._sprite.anchor._y
        }
        this._currency = null;
    };

    collect(){
        var q = {
            quantity: this._currency.getQuantity(),
            name: this._currency.getName()
        };
        this._currency.setQuantity(0);
        return q;
    };

}


export default Collectible;