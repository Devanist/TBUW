define([
    'Core/Stage',
    'GUI/GUI'
], 
function(Stage, GUI){
    
    /**
     * Virtual controller for touch devices.
     */
    var TouchController = function(){
        this._stage = new Stage();
        this._stickInitialTouch = {x: null, y: null};
        this._stickPosition = {x: 140, y: 600};
        
        this._button_a = new GUI.Image("BUTTON_A", {x: window.innerWidth - 100, y: 700}, PIXI.loader.resources.core_button_a.texture);
        this._button_b = new GUI.Image("BUTTON_B", {x: window.innerWidth, y: 600}, PIXI.loader.resources.core_button_b.texture);
        this._button_x = new GUI.Image("BUTTON_X", {x: window.innerWidth - 200, y: 600}, PIXI.loader.resources.core_button_x.texture);
        this._button_y = new GUI.Image("BUTTON_Y", {x: window.innerWidth - 100, y: 500}, PIXI.loader.resources.core_button_y.texture);
        
        this._analog_ring = new GUI.Image("ANALOG_RING", {x:70, y:530}, PIXI.loader.resources.core_ring.texture);
        
        this._stage.add(this._button_a);
        this._stage.add(this._button_b);
        this._stage.add(this._button_x);
        this._stage.add(this._button_y);
        this._stage.add(this._analog_ring);
        
        this._analog_stick = new GUI.Image("ANALOG_STICK", {x: this._stickPosition.x, y: this._stickPosition.y}, PIXI.loader.resources.core_stick.texture);
        this._stage.add(this._analog_stick);
        
        this._state = {
            AXIS_X: 0,
            AXIS_Y: 0,
            BUTTON_A: false,
            BUTTON_B: false,
            BUTTON_X: false,
            BUTTON_Y: false,
            ANALOG_STICK: false
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
            var prev_stick_state = this._state.ANALOG_STICK;
            this._state.ANALOG_STICK = false;
            
            for(var i = 0; i < l; i+=1){
                for(var j = 0; j < this._stage._elements.length; j+=1){
                    
                    if(this._stage._elements[j]._sprite.containsPoint({x: touches[i].pageX, y: touches[i].pageY}) === true && this._stage._elements[j].getId() !== "ANALOG_RING"){
                        this._state[this._stage._elements[j].getId()] = true;
                        if(this._stage._elements[j].getId() === "ANALOG_STICK"){
                            if(prev_stick_state === false){
                                console.log('init');
                                this._stickInitialTouch = {
                                    x: touches[i].pageX,
                                    y: touches[i].pageY
                                };
                            }
                            this._state.AXIS_X = touches[i].pageX - this._stickInitialTouch.x;
                            this._state.AXIS_Y = touches[i].pageY - this._stickInitialTouch.y;
                            
                            var dx = this._stickPosition.x + this._state.AXIS_X;
                            var dy = this._stickPosition.y + this._state.AXIS_Y;
                            this._analog_stick.setPosition(
                                {
                                    x: dx , 
                                    y: dy
                                }
                            );
                        }
                        break;
                    }
                    
                }
            }
            
            if(this._state.ANALOG_STICK === false){
                this._analog_stick.setPosition(this._stickPosition);
            }
            
        }
        
    };
    
    return TouchController;
    
});