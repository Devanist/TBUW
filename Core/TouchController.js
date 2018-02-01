import Stage from './Stage';
import GUI from '../GUI/GUI';
import getScreenFactor from './Utils/commonVars';

const STICK_INITIAL_POSITION_X = 140;
const STICK_INITIAL_POSITION_Y = 600;

const BUTTON_OFFSETS = {
    A: { x: 100, y: 680 },
    B: { y: 580 },
    X: { x: 200, y: 580 },
    Y: { x: 100, y: 480 },
    ANALOG_RING: { x: 70, y: 530 }
};

/**
 * Virtual controller for touch devices.
 */
export default class TouchController {
    constructor () {
        const screenFactor = getScreenFactor();
        const { A, B, X, Y, ANALOG_RING } = BUTTON_OFFSETS;

        this._stage = new Stage();
        this._stickInitialTouch = { x: null, y: null };
        this._stickPosition = {
            x: STICK_INITIAL_POSITION_X / screenFactor,
            y: STICK_INITIAL_POSITION_Y / screenFactor
        };

        this._button_a = new GUI.Image("BUTTON_A", {x: window.innerWidth - A.x, y: A.y / screenFactor}, PIXI.Texture.fromFrame("button_a"));
        this._button_b = new GUI.Image("BUTTON_B", {x: window.innerWidth, y: B.y / screenFactor}, PIXI.Texture.fromFrame("button_b"));
        this._button_x = new GUI.Image("BUTTON_X", {x: window.innerWidth - X.x, y: X.y / screenFactor}, PIXI.Texture.fromFrame("button_x"));
        this._button_y = new GUI.Image("BUTTON_Y", {x: window.innerWidth - Y.x, y: Y.y / screenFactor}, PIXI.Texture.fromFrame("button_y"));

        this._analog_ring = new GUI.Image("ANALOG_RING", {x: ANALOG_RING.x / screenFactor, y: ANALOG_RING.y / screenFactor}, PIXI.Texture.fromFrame("ring"));

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
        const { A, X, Y } = BUTTON_OFFSETS;

        // Always keep the same screen ratio
        const screenWidth = 1280 * window.innerWidth / window.innerHeight * 0.56; //eslint-disable-line no-magic-numbers

        this._button_a.setPosition({x: screenWidth - A.x});
        this._button_b.setPosition({x: screenWidth});
        this._button_x.setPosition({x: screenWidth - X.x});
        this._button_y.setPosition({x: screenWidth - Y.x});

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
