define(['../Entities/Entities'], function(Entities){
    
    /**
     * Klasa reprezentująca scenę.
     */
    var Stage = function(){
        this._elements = [];
        this._stage = new PIXI.Container();
    };
    
    Stage.prototype = {
        
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
         */
        remove : function(id){
            var l = this._elements.length;
            for(var i = 0; i < l; i++){
                if(this._elements[i].id === id){
                    this._elements.splice(i);
                }
            }
        },        
        
        getStage : function(){
            return this._stage;
        },
        
        setSize : function(size){
            this._stage.width = size.w;
            this._stage.height = size.h;
        },
        
        setScale : function(scale){
            this._stage.scale.x = scale.x;
            this._stage.scale.y = scale.y; 
        }
        
    };
    
    return Stage;
    
});