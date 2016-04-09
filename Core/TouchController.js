define(['Core/Stage'], function(Stage){
    
    var TouchController = function(){
        this._stage = new Stage();
        
        console.log(PIXI.loader.resources);
        //use button from origin/master
        this._button_a = new PIXI.Sprite(PIXI.loader.resources.core_button_a.texture);
        this._button_b = new PIXI.Sprite(PIXI.loader.resources.core_button_b.texture);
        this._button_x = new PIXI.Sprite(PIXI.loader.resources.core_button_x.texture);
        this._button_y = new PIXI.Sprite(PIXI.loader.resources.core_button_y.texture);
        
        this._button_a.position.x = 600;
        this._button_a.position.y = 600;
        this._stage.getStage().addChild(this._button_a);
        
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