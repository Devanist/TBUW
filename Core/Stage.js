import * as PIXI from 'pixi.js';

/**
 * Klasa reprezentująca scenę.
 */
export default class Stage {
    constructor (id) {
        this._id = id;
        this._elements = [];
        this._stage = new PIXI.Container();
    }

    /**
     * Zwraca obiekt PIXI.Container (na potrzeby Loadera)
     */
    getSprite () {
        return this._stage;
    }

    /**
     * Metoda dodaje element do sceny.
     * @param {object} element Element do dodania
     */
    add (element) {
        this._elements.push(element);
        this._stage.addChild(element.getSprite());
    }

    /**
     * Metoda usuwa element ze sceny.
     * @param {string} id Identyfikator elementu
     */
    remove (id) {
        const ONLY_ITEM = 0;

        const erasedElementIndex = this._elements.findIndex((element) => element.getId() === id);
        const erasedElement = this._elements.splice(erasedElementIndex, 1)[ONLY_ITEM];
        this._stage.removeChild(erasedElement.getSprite());
    }

    removeAll () {
        this._elements = [];
        this._stage.removeChildren();
    }

    /**
     * Zwraca obiekt PIXI.Container
     * @returns {object}
     */
    getStage () {
        return this._stage;
    }

    /**
     * Zmienia rozmiar sceny
     */
    setSize (size) {
        this._stage.width = size.width;
        this._stage.height = size.height;
    }

    /**
     * Zmienia skalę, w której rysowany jest obiekt
     */
    setScale (scale) {
        this._stage.scale = scale;
    }

    getElement (id) {
        return this._elements.find((element) => element.getId() === id);
    }

    getId () {
        return this._id;
    }
}
