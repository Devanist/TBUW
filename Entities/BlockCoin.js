import BlockCoinCurrency from '../Currencies/BlockCoin';
import Collectible from './Collectible';
    
class BlockCoin extends Collectible{

    constructor(id, quantity, position) {
        super(id, PIXI.loader.resources.sprites.textures["blockcoin"], position);
        this._currency = new BlockCoinCurrency();
        this._currency.setQuantity(quantity);
        this._data.type = "BlockCoin";
        this._data.rotation = 0.1;
        this._data.collected = false;
    }

    collect(){
        if(!this._data.collected){
            var q = Collectible.prototype.collect.call(this);
            this._data.collected = true;
            this._data.originPosition = {
                x: this._sprite.position.x,
                y: this._sprite.position.y
            };
            return q;
        }
        return {quantity: 0, name: "BlockCoin"};
    }

    update(){
        if(this._data.collected){
            var dest = {};
            dest.x = -this._sprite.parent.position.x + 140;
            dest.y = -this._sprite.parent.position.y + 40;
            
            var step ={
                x: (dest.x - this._data.originPosition.x) / 15,
                y: (dest.y - this._data.originPosition.y) / 15
            };
            
            this._data.position.x += step.x;
            this._data.position.y += step.y;
            if(this._data.position.x < dest.x && this._data.position.y < dest.y){
                this._data.toBeRemoved = true;
            }
            else{
                this._sprite.position.x = this._data.position.x;
                this._sprite.position.y = this._data.position.y;
            }
            
        }        
    }

    static get Properties(){
        return {
            quantity : {
                name : "Quantity",
                type : "Number",
                defaultValue : 1
            }
        }
    }

}

export default BlockCoin;