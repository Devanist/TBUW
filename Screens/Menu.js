import Screen from '../Core/Screen';
import * as PIXI from 'pixi.js';
import { handleMouseInput, handleKeyboardInput, handleTouchInput } from './commonChoosingScreensHandlers';
import { getScreenFactor } from '../Core/Utils/commonVars';

export default class MenuScreen extends Screen {
    constructor () {
        super();

        this._screenFactor = getScreenFactor();
        this._sounds = [];
        this._buttonPressedDown = false;

        this._displacementmap = PIXI.Sprite.fromImage("Assets/Gfx/displacement_map.png");
        this._displacementmap.r = 1;
        this._displacementmap.g = 1;
        this._displacement = new PIXI.filters.DisplacementFilter(this._displacementmap);
        this._displacement.scale.x = 1.5;
        this._displacement.scale.y = 2;
        this._displacement.offset = {
            x: 0,
            y: 0
        };

        this._stage.add(this._background);
        this._stage.add(this._guiStage);
    }

    everythingLoaded () {
        this._guiStage.getElement("new_game")
            .active(true)
            .setCallback(
                () => {
                    this._onUpdateAction = this.EVENT.CHANGE;
                    this._nextScreen = "chapter_choose";
                }
            );
        this._sounds.push({name: "home_beforethenight"});
    }

    update (keysState, clicks, touches) {
        const MAX_DISPLACEMENT_Y_SCALE = 6;
        const INITIAL_DISPLACEMENT_Y_SCALE = 1;
        const BIG_SCREEN_FACTOR = 1;
        const BACKGROUND_INDEX = 0;
        const background = this._background._elements[BACKGROUND_INDEX];

        background._sprite.width = this._screenFactor === BIG_SCREEN_FACTOR
            ? window.innerWidth / (window.innerHeight * 1.6 / 1280) //eslint-disable-line no-magic-numbers
            : background._sprite.width = 640; //eslint-disable-line no-magic-numbers

        handleKeyboardInput.call(this, keysState);
        handleMouseInput.call(this, clicks);
        handleTouchInput.call(this, touches);

        this._guiStage._elements.forEach((element) => {
            if (element.isEnabled() && element.isActive()) {
                this._displacement.scale.y = this._displacement.scale.y < MAX_DISPLACEMENT_Y_SCALE
                    ? this._displacement.scale.y + 0.1 //eslint-disable-line no-magic-numbers
                    : INITIAL_DISPLACEMENT_Y_SCALE;
                element._text.filters = [this._displacement];
            }
        });

        return {action: this._onUpdateAction, changeTo: this._nextScreen, playSound: this._sounds, sameMusic: true};
    }
}
