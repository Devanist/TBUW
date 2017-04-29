import Entities from '../Entities/Entities';
import * as PIXI from 'pixi.js';

/**
 * Klasa reprezentująca scenę.
 */
class Stage{

    constructor(id){
        this._id = id;
        this._elements = [];
        this._stage = new PIXI.Container();
    }

    /**
     * Zwraca obiekt PIXI.Container (na potrzeby Loadera)
     */
    getSprite(){
        return this._stage;
    }
    
    /**
     * Metoda dodaje element do sceny.
     * @param {object} element Element do dodania
     */
    add(element){
        this._elements.push(element);
        this._stage.addChild(element.getSprite());
    }
    
    /**
     * Metoda usuwa element ze sceny.
     * @param {string} id Identyfikator elementu
     */
    remove(id){
        var l = this._elements.length;
        for(var i = 0; i < l; i++){
            if(this._elements[i].getId() === id){
                var erasedElement = this._elements.splice(i, 1)[0];
                this._stage.removeChild(erasedElement.getSprite());
                break;
            }
        }
    }   
    
    removeAll(){
        for(let i = this._elements.length - 1; i >= 0 ; i--){
            this._elements.splice(i,1);
            this._stage.removeChild(this._stage.children[i]);
        }
    }
    
    /**
     * Zwraca obiekt PIXI.Container
     * @returns {object}
     */
    getStage(){
        return this._stage;
    }
    
    /**
     * Zmienia rozmiar sceny
     */
    setSize(size){
        this._stage.width = size.w;
        this._stage.height = size.h;
    }
    
    /**
     * Zmienia skalę, w której rysowany jest obiekt
     */
    setScale(scale){
        this._stage.scale.x = scale.x;
        this._stage.scale.y = scale.y;
    }
    
    getElement(id){
        var l = this._elements.length;
        for(var i = 0; i < l; i++){
            if(this._elements[i].getId !== null && this._elements[i].getId !== undefined && this._elements[i].getId() === id){
                return this._elements[i];
            }
        }
    }
    
    getId(){
        return this._id;
    }

}

export default Stage;