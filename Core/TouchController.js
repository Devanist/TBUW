import Stage from './Stage';
import GUI from '../GUI/GUI';
    
/**
 * Virtual controller for touch devices.
 */
export default class TouchController {
    constructor () {
        const small = window.innerWidth <= 640 ? 2 : 1;

        this._stage = new Stage();
        this._stickInitialTouch = {x: null, y: null};
        this._stickPosition = {x: 140 / small, y: 600 / small};

        this._button_a = new GUI.Image("BUTTON_A", {x: window.innerWidth - 100, y: 680 / small}, PIXI.Texture.fromFrame("button_a"));
        this._button_b = new GUI.Image("BUTTON_B", {x: window.innerWidth, y: 580}, PIXI.Texture.fromFrame("button_b"));
        this._button_x = new GUI.Image("BUTTON_X", {x: window.innerWidth - 200, y: 580 / small}, PIXI.Texture.fromFrame("button_x"));
        this._button_y = new GUI.Image("BUTTON_Y", {x: window.innerWidth - 100, y: 480 / small}, PIXI.Texture.fromFrame("button_y"));

        this._analog_ring = new GUI.Image("ANALOG_RING", {x: 70 / small, y: 530 / small}, PIXI.Texture.fromFrame("ring"));

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

    getState () {
        return this._state;
    }

    setState (key, state) {
        this._state[key] = state;
    }

    getStage () {
        return this._stage;
    }

    /**
     * Metoda uaktualniająca stan przycisków wirtualnego pada.
     */
    updateState (touches) {
        var w = 1280 * window.innerWidth / window.innerHeight * 0.56;

        this._button_a.setPosition({x: w - 100});
        this._button_b.setPosition({x: w});
        this._button_x.setPosition({x: w - 200});
        this._button_y.setPosition({x: w - 100});

        this._state.BUTTON_A = false;
        this._state.BUTTON_B = false;
        this._state.BUTTON_X = false;
        this._state.BUTTON_Y = false;
        var prev_stick_state = this._state.ANALOG_STICK;
        this._state.ANALOG_STICK = false;

        touches.forEach((touch) => {
            const { pageX: x, pageY: y } = touch;

            this._stage._elements.forEach((element) => {
                const elementId = element.getId();
                if (element._sprite.containsPoint({ x, y }) && elementId !== "ANALOG_RING") {
                    this._state[elementId] = true;

                    if (elementId === "ANALOG_STICK" && !prev_stick_state) {
                        this._stickInitialTouch = { x, y };
                    }

                    this._state.AXIS_X = x - this._stickInitialTouch.x;
                    this._state.AXIS_Y = y - this._stickInitialTouch.y;

                    this._analog_stick.setPosition(
                        {
                            x: this._stickPosition.x + this._state.AXIS_X,
                            y: this._stickPosition.y + this._state.AXIS_Y
                        }
                    );
                }
            });
        });

        if (!this._state.ANALOG_STICK) this._analog_stick.setPosition(this._stickPosition);
    }
}
