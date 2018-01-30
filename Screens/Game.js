import Screen from '../Core/Screen';
import Stage from '../Core/Stage';
import Utils from '../Core/Utils';
import TouchController from '../Core/TouchController';
import * as PIXI from 'pixi.js';

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

        this._smallScreenFactor = window.innerWidth <= 640 ? 2 : 1;

        this._touchController = new TouchController();
        if (Utils.isTouchDevice()) {
            this._stage.add(this._touchController.getStage());
        }

        this._GRAVITY = 0.7 / this._smallScreenFactor;
        this._AIR_RES = 0.2 / this._smallScreenFactor;
        this._escapeDown = true;
        this._isPause = false;
        this._updateWorker = new Worker('Screens/GameWorker.js');

        this._updateWorker.onmessage = function (respond) {
            const anwser = JSON.parse(respond.data);
            if (anwser.LOSE) {
                this._lose = true;
            }
            else if (anwser.WON && !this._isPause) {
                this._won = true;
                this._guiStage.getElement("pauseBackground").display(true);
                this._guiStage.getElement("wonLabel").display(true);
                this._guiStage.getElement("wonButton").display(true).active(true);

                this._isPause = true;
            }
            this._sounds = anwser.SOUNDS;
            this._gameStage.getStage().position = anwser.CONTAINER;

            anwser.ELEMENTS.forEach((elem, index) => {
                const temp = this._gameStage._elements[index];
                if (!this._player && temp._data.type === "Player") {
                    this._player = temp;
                }
                temp._data = elem;
                temp._sprite.rotation = elem.currentRotationAngle;

                if (temp.update) {
                    temp.update();
                }

                if (temp._data.type === "Player" && temp.getPosition().y > 1000) {
                    this._lose = true;
                }

                if (this._lose === true && !this._isPause) {
                    this._guiStage.getElement("pauseBackground").display(true);
                    this._guiStage.getElement("LOSE").display(true);
                    this._guiStage.getElement("RETRY").display(true).active(true);

                    this._isPause = true;
                    this._updateWorker.terminate();
                    return;
                }
            });

            this._player.nextFrame((this._player._data.state.moving / 10) | 0);

            anwser.REMOVE_LIST.forEach((item) => {
                this._gameStage._elements.forEach((elem) => {
                    if (item === elem.getId()) {
                        if (elem.getType() === "BlockCoin") {
                            if (elem._data.toBeRemoved) {
                                this._gameStage.remove(item);
                                this._sounds.push({ name: "collect_coin" });
                            }
                            this._player.collectCurrency(elem.collect());
                        }
                        return;
                    }
                });
            });
        }.bind(this);
    }

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
    };

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
    };

    /**
     * Method that prepares data and send it to worker. It also handle the user input that must be handled in main thread.
     * In the end it returns information to the application logic.
     * @param {Object} keysState Keyboard state
     * @param {Object} clicks Mouse state
     * @param {Object} touches Touch device state
     */
    update (keysState, clicks, touches) {
        //Background scaling
        this._background._elements[0]._sprite.width = this._background._elements[0]._sprite._texture.baseTexture.realWidth * window.innerWidth / window.innerHeight;

        var temp = null;

        //Mouse clicks handling
        clicks.forEach((click) => {
            const { clientX: x, clientY: y } = click;
            this._guiStage._elements.forEach((element) => {
                if (element.triggerCallback && element._sprite.containsPoint({x, y})) element.triggerCallback();
            });
        });

        //Touch handling
        if (Utils.isTouchDevice()) {
            this._touchController.updateState(touches);

            touches.forEach((touch) => {
                const { pageX: x, pageY: y } = touch;
                this._guiStage._elements.forEach((elem) => {
                    if (elem.triggerCallback && elem._sprite.containsPoint({x, y})) elem.triggerCallback();
                });
            });
        }

        //Handling escape key here, because if pause is on, worker is not working.
        if (keysState.ESCAPE) {
            this.pauseHandler();
        }
        else {
            this._escapeDown = true;
        }

        if (!this._isPause) {
            //Preparing data and sending it to worker.
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
                PLAYER_CURRENCIES: {}
            };

            if (this._player) {
                data.PLAYER_CURRENCIES = {
                    BlockCoin: this._player._currencies.getQuantity("BlockCoin")
                };
            }

            this._gameStage._elements.forEach((elem) => {
                elem._data.size.width = elem._sprite.width;
                elem._data.size.height = elem._sprite.height;
                data.ELEMENTS.push(elem._data);
            });

            this._guiStage._elements.forEach((element) => {
                element._data.currentRotationAngle += element._data.rotation;
                element._sprite.rotation = element._data.currentRotationAngle;
                if (element.getId() === "blockcoinValue" && this._player) {
                    element.setText(this._player._currencies.getQuantity("BlockCoin"));
                }
            });
            this._updateWorker.postMessage(JSON.stringify(data));
        }
        else {
            let i = 0, 
                j = 0;
            if (keysState.ARROW_DOWN || keysState.S) {
                if (this._buttonPressedDown === false) {
                    this._buttonPressedDown = true;
                    while (i != 2) {
                        if (j == this._guiStage._elements.length) {
                            j = 0;
                        }
                        temp = this._guiStage._elements[j];
                        if (temp.isEnabled() && temp.isActive()) {
                            temp.active(false);
                            temp._text.filters = null;
                            i = 1;
                            j+= 1;
                            continue;
                        }
                        if (i == 1 && temp.isEnabled()) {
                            temp.active(true);
                            i = 2;
                        }
                        else {
                            j+= 1;
                        }
                    }
                }
            }

            if (keysState.ARROW_UP || keysState.W) {
                if (this._buttonPressedDown === false) {
                    this._buttonPressedDown = true;
                    while (i != 2) {
                        if (j == -1) {
                            j = this._guiStage._elements.length - 1;
                        }
                        temp = this._guiStage._elements[j];
                        if (temp.isEnabled() && temp.isActive()) {
                            temp.active(false);
                            temp._text.filters = null;
                            i = 1;
                            j-= 1;
                            continue;
                        }
                        if (i == 1 && temp.isEnabled()) {
                            temp.active(true);
                            i = 2;
                        }
                        else {
                            j-= 1;
                        }
                    }
                }
            }

            if (keysState.ENTER) {
                this._guiStage._elements.forEach((element) => {
                    if (element && element.isActive()) {
                        element.triggerCallback();
                    }
                });
            }

            if (!keysState.ARROW_DOWN && !keysState.S && !keysState.ARROW_UP && !keysState.W) {
                this._buttonPressedDown = false;
            }

            this._guiStage._elements.forEach((element) => {
                if (element.isActive() && keysState.ENTER) {
                    element.triggerCallback();
                }
            });

            this._guiStage._elements.forEach((element) => {
                if (element.isEnabled() && element.isActive()) {
                    this._displacement.scale.y = this._displacement.scale.y < 6 ? this._displacement.scale.y += 0.1 : 1;
                    element._text.filters = [this._displacement];
                }
            });
        }

        return {action: this._onUpdateAction, params: this._nextScreenParams, changeTo: this._nextScreen, playSound: this._sounds};
    };
}
