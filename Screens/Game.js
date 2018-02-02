import Screen from '../Core/Screen';
import Stage from '../Core/Stage';
import Utils from '../Core/Utils';
import { getScreenFactor} from '../Core/Utils/commonVars';
import TouchController from '../Core/TouchController';
import * as PIXI from 'pixi.js';
import { handleTouchInput, handleMouseInput, handleKeyboardInput } from './commonChoosingScreensHandlers';

const BACKGROUND_IMAGE_INDEX = 0;
const MAX_DISPLACEMENT_Y_SCALE = 6;
const INITIAL_DISPLACEMENT_Y_SCALE = 1;

function setUpDisplacementFilter () {
    const displacementMap = PIXI.Sprite.fromImage("Assets/Gfx/displacement_map.png");
    displacementMap.r = 1;
    displacementMap.g = 1;

    const displacement = new PIXI.filters.DisplacementFilter(displacementMap);
    displacement.scale.x = 1.5;
    displacement.scale.y = 2;
    displacement.offset = {
        x: 0,
        y: 0
    };

    return displacement;
}

/**
 * Game screen. Here is all logic responsible for displaying actual gameplay.
 * @class
 * @extends Screen
 * @param {object} params Screen parameters
 */
export default class GameScreen extends Screen {
    constructor (params) {
        super();
        this._gameStage = new Stage();
        this._touchController = new TouchController();

        this._stage.add(this._background);
        this._stage.add(this._gameStage);
        this._stage.add(this._guiStage);
        this._winConditions = [];
        this._sounds = [];
        this._levelEndX = null;
        this._lose = false;
        this._won = false;
        this._music = null;
        this._back = params.back;
        this._retry = params;

        this._smallScreenFactor = getScreenFactor();
        this._displacement = setUpDisplacementFilter();

        if (Utils.isTouchDevice()) this._stage.add(this._touchController.getStage());

        this._GRAVITY = 0.7 / this._smallScreenFactor; // eslint-disable-line no-magic-numbers
        this._AIR_RES = 0.2 / this._smallScreenFactor; // eslint-disable-line no-magic-numbers

        this._buttonPressedDown = false;
        this._escapeDown = true;
        this._isPause = false;

        this._player = null;

        this._updateWorker = new Worker('Screens/GameWorker.js');
        this._updateWorker.onmessage = this.handleWorkerMessage.bind(this);
    }

    getPlayerReference () {
        return this._gameStage._elements.find((element) => element._data.type === "Player");
    }

    handleWorkerMessage (respond) {
        const anwser = JSON.parse(respond.data);

        if (anwser.LOSE) {
            this._lose = true;
        }
        else if (anwser.WON && !this._isPause) {
            this._won = true;
            this.showWinWindow();
            this._updateWorker.terminate();
        }

        if (this._lose && !this._isPause) {
            this.showLoseWindow();
            this._updateWorker.terminate();
        }
        this._sounds = anwser.SOUNDS;
        this._gameStage.getStage().position = anwser.CONTAINER;

        anwser.ELEMENTS.forEach((element, index) => {
            const stageElement = this._gameStage._elements[index];
            stageElement._data = element;
            stageElement._sprite.rotation = element.currentRotationAngle;

            if (stageElement.update) stageElement.update();
        });

        this._player.nextFrame((this._player._data.state.moving / 10) | 0); // eslint-disable-line no-magic-numbers
        this.clearStage(anwser.REMOVE_LIST);
    };

    /**
     * Returns the screen main stage.
     * @returns {Stage}
     */
    getMainStage () {
        return this._gameStage;
    }

    /**
     * Returns array with sounds to play.
     * @returns {Array}
     */
    getSoundsContainer () {
        return this._sounds;
    }

    /**
     * Assign music to play in game.
     * @param {string} music Song's name
     */
    setMusic (music) {
        this._music = music;
    }

    /**
     * Sets the x-coord where to stop moving map.
     * @param {Number} x x-coord
     */
    setEndX (x) {
        this._levelEndX = x;
    }

    /**
     * Returns an array with win conditions for given level.
     * returns {Array}
     */
    getWinConditions () {
        return this._winConditions;
    }

    /**
     * Method that handles situation, when player turns on the pause.
     */
    pauseHandler () {
        if (this._escapeDown && !this._lose && !this._won) {
            this._isPause = !this._isPause;
            this._escapeDown = false;

            if (this._isPause === true) {
                this.showPauseWindow();
            }
            else {
                this.showPauseWindow(false);
            }
        }
    };

    showPauseWindow (shouldShow = true) {
        if (shouldShow) {
            this._guiStage.getElement("pauseBackground").display(true);
            this._guiStage.getElement("pauseLabel").display(true);

            this._guiStage.getElement("resumeButton")
                .display(true)
                .active(true)
                .setCallback(
                    () => {
                        this.pauseHandler();
                    }
                );

            this._guiStage.getElement("returnButton")
                .display(true)
                .setCallback(
                    () => {
                        this._onUpdateAction = this.EVENT.CHANGE;
                        this._nextScreen = "level_choose";
                        this._nextScreenParams = {
                            cfg: this._back
                        };
                    }
                );
        }
        else {
            this._guiStage.getElement("pauseBackground").display(false);
            this._guiStage.getElement("pauseLabel").display(false);
            this._guiStage.getElement("resumeButton").display(false);
            this._guiStage.getElement("returnButton").display(false);
        }
    }

    showWinWindow () {
        this._guiStage.getElement("pauseBackground").display(true);
        this._guiStage.getElement("wonLabel").display(true);
        this._guiStage.getElement("wonButton").display(true).active(true);

        this._isPause = true;
    }

    showLoseWindow () {
        this._guiStage.getElement("pauseBackground").display(true);
        this._guiStage.getElement("LOSE").display(true);
        this._guiStage.getElement("RETRY").display(true).active(true);

        this._isPause = true;
    }

    everythingLoaded () {
        this._guiStage.getElement("wonButton").setCallback(
            () => {
                this._onUpdateAction = this.EVENT.CHANGE;
                this._nextScreen = "level_choose";
                this._nextScreenParams = {
                    cfg: this._back
                };
            }
        );

        this._guiStage.getElement("RETRY").setCallback(
            () => {
                this._onUpdateAction = this.EVENT.RESTART;
                this._nextScreen = "game";
                this._nextScreenParams = this._retry;
            }
        );
        this._player = this.getPlayerReference();
    };

    clearStage (elementsToRemove) {
        elementsToRemove.forEach((itemToRemove) => {
            this._gameStage._elements.forEach((element) => {
                if (itemToRemove === element.getId()) {
                    if (element.getType() === "BlockCoin") {
                        if (element._data.toBeRemoved) {
                            this._gameStage.remove(itemToRemove);
                            this._sounds.push({ name: "collect_coin" });
                        }
                        this._player.collectCurrency(element.collect());
                    }
                }
            });
        });
    }

    prepareDataForWorker (keysState) {
        const data = {
            SMALL: this._smallScreenFactor,
            CONTAINER: {
                x: this._gameStage.getStage().position._x,
                y: this._gameStage.getStage().position._y
            },
            KEYS_STATE: keysState,
            LEVEL_END_X: this._levelEndX,
            WINDOW_WIDTH: window.innerWidth,
            VCONTROLLER: this._touchController.getState(),
            GRAVITY: this._GRAVITY,
            AIR_RES: this._AIR_RES,
            SOUNDS: [{name: this._music}],
            PAUSE: this._isPause,
            ELEMENTS: [],
            WIN_CONDITIONS: this._winConditions,
            PLAYER_CURRENCIES: this._player
                ? { BlockCoin: this._player._currencies.getQuantity("BlockCoin")}
                : {}
        };

        this._gameStage._elements.forEach((elem) => {
            elem._data.size.width = elem._sprite.width;
            elem._data.size.height = elem._sprite.height;
            data.ELEMENTS.push(elem._data);
        });

        return data;
    }

    /**
     * Method that prepares data and send it to worker. It also handle the user input that must be handled in main thread.
     * In the end it returns information to the application logic.
     * @param {Object} keysState Keyboard state
     * @param {Object} clicks Mouse state
     * @param {Object} touches Touch device state
     */
    update (keysState, clicks, touches) {
        //Background scaling
        const backgroundImageSprite = this._background._elements[BACKGROUND_IMAGE_INDEX]._sprite;
        backgroundImageSprite.width = backgroundImageSprite._texture.baseTexture.realWidth * window.innerWidth / window.innerHeight;

        handleMouseInput.call(this, clicks);
        if (Utils.isTouchDevice()) this._touchController.updateState(touches);
        handleTouchInput.call(this, touches);

        // Handling escape key here so it can work both in and outside pause menu.
        if (keysState.ESCAPE) {
            this.pauseHandler();
        }
        else {
            this._escapeDown = true;
        }

        if (this._isPause) {
            handleKeyboardInput.call(this, keysState);

            this._guiStage._elements.forEach((element) => {
                if (element.isEnabled() && element.isActive()) {
                    this._displacement.scale.y = this._displacement.scale.y < MAX_DISPLACEMENT_Y_SCALE
                        ? this._displacement.scale.y + 0.1 // eslint-disable-line no-magic-numbers
                        : INITIAL_DISPLACEMENT_Y_SCALE;
                    element._text.filters = [this._displacement];
                }
            });
        }
        else {
            this._updateWorker.postMessage( JSON.stringify( this.prepareDataForWorker(keysState) ));

            this._guiStage._elements.forEach((element) => {
                element._data.currentRotationAngle += element._data.rotation;
                element._sprite.rotation = element._data.currentRotationAngle;
                if (element.getId() === "blockcoinValue" && this._player) {
                    element.setText(this._player._currencies.getQuantity("BlockCoin"));
                }
            });
        }

        return {action: this._onUpdateAction, params: this._nextScreenParams, changeTo: this._nextScreen, playSound: this._sounds};
    };
}
