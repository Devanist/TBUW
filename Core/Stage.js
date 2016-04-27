define(['Entities/Entities'], function(Entities){
    
    /**
     * Klasa reprezentująca scenę.
     */
    var Stage = function(){
        this._elements = [];
        this._stage = new PIXI.Container();
    };
    
    Stage.prototype = {
        
        /**
         * Zwraca obiekt PIXI.Container (na potrzeby Loadera)
         */
        getSprite: function(){
            return this._stage;
        },
        
        /**
         * Metoda dodaje element do sceny.
         * @param {object} element Element do dodania
         */
        add : function(element){
            this._elements.push(element);
            this._stage.addChild(element.getSprite());
        },
        
        /**
         * Metoda usuwa element ze sceny.
         * @param {string} id Identyfikator elementu
         */
        remove : function(id){
            var l = this._elements.length;
            for(var i = 0; i < l; i++){
                if(this._elements[i].getId() === id){
                    var erasedElement = this._elements.splice(i, 1)[0];
                    this._stage.removeChild(erasedElement._sprite);
                    break;
                }
            }
        },       
        
        removeAll : function(){
            var l = this._elements.length;
            for(var i = 0; i < l; i++){
                this._elements.splice(i);
                this._stage.removeChild(i);
            }
        },
        
        /**
         * Zwraca obiekt PIXI.Container
         * @returns {object}
         */
        getStage : function(){
            return this._stage;
        },
        
        /**
         * Zmienia rozmiar sceny
         */
        setSize : function(size){
            this._stage.width = size.w;
            this._stage.height = size.h;
        },
        
        /**
         * Zmienia skalę, w której rysowany jest obiekt
         */
        setScale : function(scale){
            this._stage.scale.x = scale.x;
            this._stage.scale.y = scale.y;
        },
        
        getElement : function(id){
            var l = this._elements.length;
            for(var i = 0; i < l; i++){
                if(this._elements[i].getId !== null && this._elements[i].getId !== undefined && this._elements[i].getId() === id){
                    return this._elements[i];
                }
            }
        }
        
    };
    
    return Stage;
    
});