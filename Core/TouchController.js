import Stage from './Stage';
import GUI from '../GUI/GUI';
    
/**
 * Virtual controller for touch devices.
 */
class TouchController{

    constructor(){
        this._stage = new Stage();
        this._stickInitialTouch = {x: null, y: null};
        var small = 1;
        if(window.innerWidth <= 640){
            small = 2;
        }
        this._stickPosition = {x: 140 / small, y: 600 / small};
        
        this._button_a = new GUI.Image("BUTTON_A", {x: window.innerWidth - 100, y: 680 / small}, PIXI.Texture.fromFrame("button_a"));
        this._button_b = new GUI.Image("BUTTON_B", {x: window.innerWidth, y: 580}, PIXI.Texture.fromFrame("button_b"));
        this._button_x = new GUI.Image("BUTTON_X", {x: window.innerWidth - 200, y: 580 / small}, PIXI.Texture.fromFrame("button_x"));
        this._button_y = new GUI.Image("BUTTON_Y", {x: window.innerWidth - 100, y: 480 / small}, PIXI.Texture.fromFrame("button_y"));
        
        this._analog_ring = new GUI.Image("ANALOG_RING", {x:70 / small, y:530 / small}, PIXI.Texture.fromFrame("ring"));
        
        this._stage.add(this._button_a);
        this._stage.add(this._button_b);
        this._stage.add(this._button_x);
        this._stage.add(this._button_y);
        this._stage.add(this._analog_ring);
        
        this._analog_stick = new GUI.Image("ANALOG_STICK", {x: this._stickPosition.x, y: this._stickPosition.y}, PIXI.Texture.fromFrame("stick"));
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
    }

    getState(){
        return this._state;
    }
    
    setState(key, state){
        this._state[key] = state;
    }
    
    getStage(){
        return this._stage;
    }
    
    /**
     * Metoda uaktualniająca stan przycisków wirtualnego pada.
     */
    updateState(touches){
        var l = touches.length;
        var elem = null;

        var w = 1280 * window.innerWidth / window.innerHeight *0.56;
        
        this._button_a.setPosition({x: w - 100});
        this._button_b.setPosition({x: w});
        this._button_x.setPosition({x:w - 200});
        this._button_y.setPosition({x: w - 100});
        
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

}

export default TouchController;