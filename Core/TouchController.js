define([
    'Core/Stage',
    'GUI/GUI'
], 
function(Stage, GUI){
    
    var TouchController = function(){
        this._stage = new Stage();
        
        console.log(PIXI.loader.resources);
        
        this._button_a = new GUI.Button("button_a", {x: 1000, y: 700}, PIXI.loader.resources.core_button_a.texture, function(){console.log('button a touched');});
        this._button_b = new GUI.Button("button_b", {x: 1100, y: 600}, PIXI.loader.resources.core_button_b.texture, null);
        this._button_x = new GUI.Button("button_x", {x: 900, y: 600}, PIXI.loader.resources.core_button_x.texture, null);
        this._button_y = new GUI.Button("button_y", {x: 1000, y: 500}, PIXI.loader.resources.core_button_y.texture, null);
        
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
        }
        
    };
    
    return TouchController;
    
});