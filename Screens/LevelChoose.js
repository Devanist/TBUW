import Screen from '../Core/Screen';
import GUI from '../GUI/GUI';
import Utils from '../Core/Utils';
import * as PIXI from 'pixi.js';

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

        this._small = window.innerWidth <= 640 ? 2 : 1;

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
            const num = index < 10 ? `0${index}` : index.toString();
            const temp = new GUI.Button(
                `${level.type}_${level.name}`,
                {x: 300 * (index % 3 + 1), y: 200 * ((index / 3 | 0) + 1)},
                PIXI.loader.resources.sprites.textures[frame],
                num,
                {size_override: true, bitmap: true, fontSize: 60 / this._small, fontFamily: "Cyberdyne Expanded", fill: 0xffffff, align: "center"},
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

    handleKeyboardInput (keysState) {
        let element, i, j;
        if ((keysState.ARROW_DOWN || keysState.S) && !this._buttonPressedDown) {
            this._buttonPressedDown = true;
            while (i !== 2) {
                if (j === this._guiStage._elements.length) j = 0;

                element = this._guiStage._elements[j];
                if (element && element.isEnabled() && element.isActive()) {
                    element._data.active = false;
                    element._sprite.filters = null;
                    i = 1;
                    j+=1;
                    continue;
                }
                if (i === 1 && element && element.isEnabled()) {
                    element._data.active = true;
                    i = 2;
                }
                else {
                    j+=1;
                }
            }
        }

        if ((keysState.ARROW_UP || keysState.W) && this._buttonPressedDown === false) {
            this._buttonPressedDown = true;
            while (i !== 2) {
                if (j === -1) {
                    j = this._guiStage._elements.length - 1;
                }
                element = this._guiStage._elements[j];
                if (element && element.isEnabled() && element.isActive()) {
                    element._data.active = false;
                    element._sprite.filters = null;
                    i = 1;
                    j-=1;
                    continue;
                }
                if (i === 1 && element && element.isEnabled()) {
                    element._data.active = true;
                    i = 2;
                }
                else {
                    j-=1;
                }
            }
        }

        if (keysState.ENTER) {
            this._guiStage._elements.forEach((guiElement) => {
                if (guiElement && guiElement.isActive()) guiElement.triggerCallback()
            });
        }

        if (!keysState.ARROW_DOWN && !keysState.S && !keysState.ARROW_UP && !keysState.W) {
            this._buttonPressedDown = false;
        }
    }

    handleMouseInput (clicks) {
        clicks.forEach((click) => {
            const { clientX: x, clientY: y } = click;
            this._guiStage._elements.forEach((element) => {
                if (element.triggerCallback && element._sprite.containsPoint({x, y}))
                    element.triggerCallback();
            });
        });
    }

    handleTouchInput (touches) {
        if (!Utils.isTouchDevice()) return;

        touches.forEach((touch) => {
            const { pageX: x, pageY: y } = touch;
            this._guiStage._elements.forEach((element) => {
                if (element.triggerCallback && element._sprite.containsPoint({x, y}))
                    element.triggerCallback();
            });
        });
    }

    update (keysState, clicks, touches) {
        this.handleKeyboardInput(keysState);
        this.handleMouseInput(clicks);
        this.handleTouchInput(touches);

        this._guiStage._elements.forEach((element) => {
            if (element.isEnabled() && element.isActive()) {
                this._displacement.scale.y = this._displacement.scale.y < 6
                    ? this._displacement.scale.y += 0.1
                    : 1;
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
