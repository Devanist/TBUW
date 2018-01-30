import Screen from '../Core/Screen';
import Utils from '../Core/Utils';
import * as PIXI from 'pixi.js';

export default class MenuScreen extends Screen {
    constructor () {
        super();

        this._small = window.innerWidth <= 640 ? 2 : 1;
        this._sounds = [{name: "home_beforethenight"}];
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
    }

    handleKeyboardInputs (keysState) {
        let temp, i, j;
        if ((keysState.ARROW_DOWN || keysState.S) && this._buttonPressedDown === false) {
            this._buttonPressedDown = true;
            while (i != 2) {
                if (j == this._guiStage._elements.length) {
                    j = 0;
                }
                temp = this._guiStage._elements[j];
                if (temp.isEnabled() && temp.isActive()) {
                    temp._data.active = false;
                    temp._text.filters = null;
                    i = 1;
                    j+=1;
                    continue;
                }
                if (i == 1 && temp.isEnabled()) {
                    temp._data.active = true;
                    i = 2;
                }
                else {
                    j+=1;
                }
            }
        }

        if ((keysState.ARROW_UP || keysState.W) && this._buttonPressedDown === false) {
            this._buttonPressedDown = true;
            while (i != 2) {
                if (j == -1) {
                    j = this._guiStage._elements.length - 1;
                }
                temp = this._guiStage._elements[j];
                if (temp.isEnabled() && temp.isActive()) {
                    temp._data.active = false;
                    temp._text.filters = null;
                    i = 1;
                    j-=1;
                    continue;
                }
                if (i == 1 && temp.isEnabled()) {
                    temp._data.active = true;
                    i = 2;
                }
                else {
                    j-=1;
                }
            }
        }

        if (keysState.ENTER) {
            this._guiStage._elements.forEach((element) => {
                if (element.isActive()) element.triggerCallback();
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
                if (element._sprite.containsPoint({x, y})) element.triggerCallback();
            });
        });
    }

    handleTouch (touches) {
        if (!Utils.isTouchDevice()) return;

        touches.forEach((touch) => {
            const { pageX: x, pageY: y } = touch;
            this._guiStage._elements.forEach((element) => {
                if (element._sprite.containsPoint({x, y})) element.triggerCallback();
            });
        });
    }

    update (keysState, clicks, touches) {
        this._background._elements[0]._sprite.width = this._small === 1
            ? window.innerWidth / (window.innerHeight * 1.6 / 1280)
            : this._background._elements[0]._sprite.width = 640;

        this.handleKeyboardInputs(keysState);
        this.handleMouseInput(clicks);
        this.handleTouch(touches);

        this._guiStage._elements.forEach((element) => {
            if (element.isEnabled() && element.isActive()) {
                this._displacement.scale.y = this._displacement.scale.y < 6
                    ? this._displacement.scale.y + 1
                    : 1;
                element._text.filters = [this._displacement];
            }
        });

        return {action: this._onUpdateAction, changeTo: this._nextScreen, playSound: this._sounds, sameMusic: true};

    }

}
