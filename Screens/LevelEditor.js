import Screen from '../Core/Screen';
import Stage from '../Core/Stage';
import Entities from '../Entities/Entities';
import appendEditorRootSection from '../Core/Utils/appendEditorRootSection';

import React from 'react';
import {render} from 'react-dom';

import LevelEditorMain from '../Assets/Editor/LevelEditor/LevelEditorMain';

import style from '../Assets/Editor/editor.scss'; //eslint-disable-line no-unused-vars

export default class LevelEditor extends Screen {
    constructor () {
        super();

        this._background = new Stage("background");
        this._background.add(new Entities.Background());
        this._gameStage = new Stage("game");

        this._stage.add(this._background);
        this._stage.add(this._gameStage);

        this._musicPlaying = false;
        this._sounds = [];

        this._startClick = {
            x: 0,
            y: 0
        };

        const FIRST_EVENT = 0;

        this._buttonDown = false;

        document.querySelector("canvas").className = "editorCanvas";

        document.querySelector("canvas").addEventListener("mousedown", (event) => {
            if (!event.button) {
                this._startClick.x = event.clientX;
                this._startClick.y = event.clientY;
                this._buttonDown = true;
            }
        });

        document.querySelector("canvas").addEventListener("mouseup", () => {
            this._buttonDown = false;
        });

        document.querySelector("canvas").addEventListener("mousemove", (event) => {
            if (this._buttonDown === true) {
                this._gameStage.getStage().position.x += event.clientX - this._startClick.x;
                this._gameStage.getStage().position.y += event.clientY - this._startClick.y;
                this._startClick.x = event.clientX;
                this._startClick.y = event.clientY;
            }
        });

        document.querySelector("canvas").addEventListener("touchstart", (event) => {
            this._startClick.x = event.touches[FIRST_EVENT].clientX;
            this._startClick.y = event.touches[FIRST_EVENT].clientY;
            this._buttonDown = true;
        });

        document.querySelector("canvas").addEventListener("touchmove", (e) => {
            this._gameStage.getStage().position.x += e.touches[FIRST_EVENT].clientX - this._startClick.x;
            this._gameStage.getStage().position.y += e.touches[FIRST_EVENT].clientY - this._startClick.y;
            this._startClick.x = e.touches[FIRST_EVENT].clientX;
            this._startClick.y = e.touches[FIRST_EVENT].clientY;
        });

        render(<LevelEditorMain editorContext={this} />, appendEditorRootSection());
    }

    getMainStage () {
        return this._gameStage;
    }

    /**
     * Creates new, updated stage.
     * @param {string} stage
     */
    updateStage (stage, level) {
        const textures = PIXI.loader.resources.sprites.textures;

        if (stage === "background") {
            const ONLY_ITEM = 0;
            this._background.removeAll();
            if (level.background[ONLY_ITEM].texture) {
                this._background.add(new Entities.Background(ONLY_ITEM, textures[level.background[ONLY_ITEM].texture], 0)); // eslint-disable-line no-magic-numbers
            }
            else {
                this._background.add(new Entities.Background(ONLY_ITEM, null, 0)); // eslint-disable-line no-magic-numbers
            }
        }
        else if (stage === "game") {
            this._gameStage.removeAll();
            const PLAYER_FRAMES = 5;
            let temp;

            level.entities.forEach((entity) => {
                if (!entity) return;

                switch (entity.type) {
                    case "Background":
                        temp = new Entities.Background(entity.id, textures[entity.texture], entity.factor);
                        break;
                    case "Platform":
                        temp = new Entities.Platform(entity.id, textures[entity.texture]);
                        break;
                    case "Player":
                        const frames = [];
                        for (let j = 0; j < PLAYER_FRAMES; j++) {
                            frames.push(PIXI.Texture.fromFrame('walrus_0000' + j));
                        }
                        temp = new Entities.Player(entity.id, frames);
                        break;
                    case "BlockCoin":
                        temp = new Entities.BlockCoin(entity.id, entity.quantity);
                        break;
                    case "PositionField":
                        temp = new Entities.PositionField(entity.id);
                        break;
                    case "MovingPlatform":
                        temp = new Entities.MovingPlatform(entity.id, textures[entity.texture], entity.startPos, entity.endPos, entity.time);
                        break;
                    case "LasersFromGround":
                        temp = new Entities.LasersFromGround(entity.id);
                        break;
                    default: throw new Error(`No such type as: ${entity.type}`);
                }
                temp.setPosition(entity.position);
                if (!entity.anchor) {
                    entity.anchor = {
                        x: 0,
                        y: 0
                    };
                }
                temp.setAnchor(entity.anchor);
                temp.setRotationAngle(entity.rotation);
                this._gameStage.add(temp);
            });
        }
    }
}
