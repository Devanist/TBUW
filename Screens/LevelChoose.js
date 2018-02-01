import Screen from '../Core/Screen';
import GUI from '../GUI/GUI';
import * as PIXI from 'pixi.js';
import getScreenFactor from '../Core/Utils/commonVars';
import { handleMouseInput, handleKeyboardInput, handleTouchInput } from './commonChoosingScreensHandlers';

export default class LevelChoose extends Screen {
    constructor (params) {
        super();

        this._levels = params.cfg;
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

        this._screenFactor = getScreenFactor();

        this._sounds = [{name: "home_beforethenight"}];
        this._sameMusic = false;

        function changeScreen (name, screen) {
            this._onUpdateAction = "CHANGE";
            this._nextScreen = screen;
            this._nextScreenParams = {
                cfg: name,
                back: this._levels
            };
        }

        this._levels.forEach((level, index) => {
            const FIRST_ELEMENT = 0;
            const frame = level.type === 'cinematic' ? 'cinematic_frame' : 'frame';
            const num = index < 10 ? `0${index}` : index.toString(); //eslint-disable-line no-magic-numbers
            const temp = new GUI.Button(
                `${level.type}_${level.name}`,
                {x: 300 * (index % 3 + 1), y: 200 * ((index / 3 | 0) + 1)}, //eslint-disable-line no-magic-numbers
                PIXI.loader.resources.sprites.textures[frame],
                num,
                {size_override: true, bitmap: true, fontSize: 60 / this._screenFactor, fontFamily: "Cyberdyne Expanded", fill: 0xffffff, align: "center"}, //eslint-disable-line no-magic-numbers
                () => {
                    changeScreen.call(this, level.name, level.type === 'cinematic' ? 'cinematic' : 'game')
                }
            );
            if (index === FIRST_ELEMENT) temp._data.active = true;
            this._guiStage.add(temp);
        });

        this._stage.add(this._guiStage);
    }

    everythingLoaded () {
        this._guiStage.getElement("RETURN").setCallback(
            () => {
                this._onUpdateAction = "CHANGE";
                this._nextScreen = "chapter_choose";
                this._sameMusic = true;
            }
        );
    }

    update (keysState, clicks, touches) {
        const MAX_DISPLACEMENT_Y_SCALE = 6;
        const INITIAL_DISPLACEMENT_Y_SCALE = 1;

        handleKeyboardInput.call(this, keysState);
        handleMouseInput.call(this, clicks);
        handleTouchInput.call(this, touches);

        this._guiStage._elements.forEach((element) => {
            if (element.isEnabled() && element.isActive()) {
                this._displacement.scale.y = this._displacement.scale.y < MAX_DISPLACEMENT_Y_SCALE
                    ? this._displacement.scale.y + 0.1 //eslint-disable-line no-magic-numbers
                    : INITIAL_DISPLACEMENT_Y_SCALE;
                element._sprite.filters = [this._displacement];
            }
        });

        return {
            action: this._onUpdateAction,
            changeTo: this._nextScreen,
            params: this._nextScreenParams,
            playSound: this._sounds,
            sameMusic: this._sameMusic
        };
    }

}
