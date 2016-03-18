define([], function(){
    
    /**
     * Klasa reprezentująca scenę.
     */
    var Stage = function(){
        this._elements = [];
        this._stage = new PIXI.Container();
    };
    
    Stage.prototype = {
        
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
         */
        remove : function(id){
            var l = this._elements.length;
            for(var i = 0; i < l; i++){
                if(this._elements[i].id === id){
                    this._elements.splice(i);
                }
            }
        },
        
        /**
         * Metoda dodaje elementy do sceny na podstawie configu.
         */
        loadConfig : function(cfg){
            
        },
        
        getStage : function(){
            return this._stage;
        }
        
    };
    
    return Stage;
    
});