import Screen from '../Core/Screen';
import cfg from '../Assets/Chapters.json';
import GUI from '../GUI/GUI';
import * as PIXI from 'pixi.js';
import GUIInputHandler from '../Core/GUIInputHandler';
import { getScreenFactor } from '../Core/Utils/commonVars';

function generateItemsPositions () {
    const ROWS_NUMBER = 2;
    const COLUMNS_NUMBER = 3;
    const X_OFFSET = 300;
    const Y_OFFSET = 200;

    const itemPositions = [];

    for (let i = 1; i <= ROWS_NUMBER; i++) {
        for (let j = 1; j <= COLUMNS_NUMBER; j++) {
            itemPositions.push({
                x: X_OFFSET * j,
                y: Y_OFFSET * i
            });
        }
    }

    return itemPositions;
}

const FIRST_ITEM = 0;
const ITEM_LABEL_OFFSET_X = 158;
const ITEM_LABEL_OFFSET_Y = 120;
const LABEL_FONT_SIZE = 20;

/**
 * Chapter choosing screen.
 * @class
 * @extends Screen
 */
export default class ChapterChoose extends Screen {
    constructor () {
        super();

        this._screenFactor = getScreenFactor();
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

        this._chapters = cfg;
        this._chaptersPositions = [];

        this._chaptersPositions = generateItemsPositions();

        this._chapters.forEach((chapter, index) => {
            this._guiStage.add(
                new GUI.Button(
                    chapter.name,
                    this._chaptersPositions[index],
                    PIXI.loader.resources.sprites.textures[chapter.sprite],
                    "",
                    index === FIRST_ITEM ? {active: true} : {},
                    () => {
                        this._onUpdateAction = "CHANGE";
                        this._nextScreen = "level_choose";
                        this._nextScreenParams = {
                            cfg: chapter.levels
                        };
                    }
                )
            );
            this._guiStage.add(
                new GUI.Label(
                    chapter.name + '_label',
                    {
                        x: this._chaptersPositions[index].x - ITEM_LABEL_OFFSET_X,
                        y: this._chaptersPositions[index].y + ITEM_LABEL_OFFSET_Y
                    },
                    chapter.name,
                    {bitmap: true, fontSize: LABEL_FONT_SIZE / this._screenFactor, fontFamily: "Cyberdyne Expanded", fill: 0xffffff, align: "center"}
                )
            )
        });
        this._stage.add(this._guiStage);
        this._stage.add(this._background);
    }

    everythingLoaded () {
        this._guiStage.getElement("RETURN").setCallback(
            () => {
                this._onUpdateAction = "CHANGE";
                this._nextScreen = "menu";
            }
        );
    }

    /**
     * Method that handles user input and returns information to the application logic.
     */
    update (keysState, clicks, touches) {
        const MAX_DISPLACEMENT_Y_SCALE = 6;
        const INITIAL_DISPLACEMENT_Y_SCALE = 1;

        GUIInputHandler.call(this, keysState, clicks, touches);

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
            sameMusic: true
        };
    }
}
