define([
    'Core/Stage',
    'GUI/GUI'
], 
function(Stage, GUI){
    
    var TouchController = function(){
        this._stage = new Stage();
        
        console.log(PIXI.loader.resources);
        
        this._button_a = new GUI.Button("BUTTON_A", {x: 1000, y: 700}, PIXI.loader.resources.core_button_a.texture, null);
        this._button_b = new GUI.Button("BUTTON_B", {x: 1100, y: 600}, PIXI.loader.resources.core_button_b.texture, null);
        this._button_x = new GUI.Button("BUTTON_X", {x: 900, y: 600}, PIXI.loader.resources.core_button_x.texture, null);
        this._button_y = new GUI.Button("BUTTON_Y", {x: 1000, y: 500}, PIXI.loader.resources.core_button_y.texture, null);
        
        this._stage.add(this._button_a);
        this._stage.add(this._button_b);
        this._stage.add(this._button_x);
        this._stage.add(this._button_y);
        
        this._ring = new PIXI.Sprite(PIXI.loader.resources.core_ring.texture);
        
        this._state = {
            AXIS_X: 0,
            AXIS_Y: 0,
            BUTTON_A: false,
            BUTTON_B: false,
            BUTTON_X: false,
            BUTTON_Y: false
        };
    };
    
    TouchController.prototype = {
        
        getState: function(){
            return this._state;
        },
        
        setState: function(key, state){
            this._state[key] = state;
        },
        
        getStage : function(){
            return this._stage;
        },
        
        /**
         * Metoda uaktualniająca stan przycisków wirtualnego pada.
         */
        updateState: function(touches){
            var l = touches.length;
            var elem = null;
            this._state.BUTTON_A = false;
            this._state.BUTTON_B = false;
            this._state.BUTTON_X = false;
            this._state.BUTTON_Y = false;
            for(var i = 0; i < l; i+=1){
                for(var j = 0; j < this._stage._elements.length; j+=1){
                    if(this._stage._elements[j]._sprite.containsPoint({x: touches[i].pageX, y: touches[i].pageY})){
                        this._state[this._stage._elements[j].getId()] = true;
                        break;
                    }
                }
            }
        }
        
    };
    
    return TouchController;
    
});