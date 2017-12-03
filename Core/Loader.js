///https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/decodeAudioData

import cfg from '../Assets/assets.json';
import Entities from '../Entities/Entities';
import BoundaryBox from '../Debug/BoundaryBox';
import Stage from './Stage';
import GUI from '../GUI/GUI';

const MOBILE_WIDTH = 640;
const GRAPHIC_NAME_OFFSET = -5;
const MOBILE_FACTOR = 2;
const DESKTOP_FACTOR = 1;
const ARE_ASSETS_LOADED_CHECK_INTERVAL = 100;

/**
 * @class
 * @memberOf Core
 * @extends PIXI.loader
 * Wrapper for PIXI.loader
 */
export default class Loader {
    constructor () {
        this._cfg = cfg;
        this._preloaded = false;
        this._progressCb = null;
        this._loadedAssets = 0;
        this._areSoundsLoaded = false;
        this._graphicAssets = 0;
        this._audioAssets = this._cfg.sounds.length;
    }

    preload () {
        PIXI.loader.add(this._cfg.preload.name, this._cfg.preload.path);
        PIXI.loader.once('complete', () => {
            this._preloaded = true;
        });
        PIXI.loader.load();
    }

    /**
     * Method loading all assets given in config. When they all are loaded it triggers given callback function.
     * @param {function} callback Callback method
     */
    loadAssets (callback, speaker, rootStage) {
        const that = this;

        if (this._preloaded) {
            //Show loading screen
            const Container = new Stage();
            Container.add(new GUI.Image("loadingScreen", "center", PIXI.Texture.fromFrame("loading_off")));
            var progressbar = new GUI.Image("progressbar", "center", PIXI.Texture.fromFrame("loading_progressbar"));
            progressbar.move({x: -255, y: 50});
            Container.add(progressbar);
            var blurFilter = new PIXI.filters.BlurFilter();
            progressbar._sprite.filters = [blurFilter];
            rootStage.add(Container);

            //Load assets
            this._cfg.graphics.forEach((graphic) => {
                if (window.innerWidth <= MOBILE_WIDTH) {
                    if (graphic.name.substr(GRAPHIC_NAME_OFFSET) === "small") {
                        this._graphicAssets++;
                        PIXI.loader.add(graphic.name, graphic.path);
                    }
                }
                else {
                    if (graphic.name.substr(GRAPHIC_NAME_OFFSET) !== "small") {
                        this._graphicAssets++;
                        PIXI.loader.add(graphic.name, graphic.path);
                    }
                }
                this._allAssets = this._graphicAssets + this._cfg.sounds.length;
            });

            this._cfg.fonts.forEach((font) => {
                this._graphicAssets += 1;
                PIXI.loader.add(font.name, font.path);
            });

            this.loadSounds(cfg.sounds, speaker);

            PIXI.loader.once('complete', function cb () {
                if (that._areSoundsLoaded) {
                    rootStage.remove("loadingScreen");
                    rootStage.remove("progressbar");
                    rootStage.getStage().removeChild(Container.getStage());
                    Container.getStage().destroy();
                    callback();
                }
                else {
                    setTimeout(() => {
                        cb();
                    }, ARE_ASSETS_LOADED_CHECK_INTERVAL);
                }
            });

            if (this._progressCb) {
                PIXI.loader.on('progress', () => {
                    progressbar._sprite.filters[0].blur = 20 * Math.sin(this._loadedAssets); //eslint-disable-line no-magic-numbers
                    progressbar._sprite.width = 517 / this._allAssets * this._loadedAssets | 0; //eslint-disable-line no-magic-numbers
                    this._progressCb();
                });
            }

            PIXI.loader.load();
        }
        else {
            setTimeout(() => {
                this.loadAssets(callback, speaker, rootStage);
            }, ARE_ASSETS_LOADED_CHECK_INTERVAL);
        }
    }

    /**
     * Sets the onprogress callback function.
     * @param {function} cb Callback method
     */
    setProgressCb (cb) {
        this._progressCb = cb;
    }

    /**
     * Method returns the quantity of already loaded assets.
     * @returns {int}
     */
    assetsLoaded () {
        return this._loadedAssets;
    }

    /**
     * Method returns the quantity of all assets that should be loaded.
     * @returns {int}
     */
    allAssets () {
        return this._allAssets;
    }

    /**
     * Method increment the loaded assets counter.
     */
    incrementLoadedAssets () {
        this._loadedAssets += 1;
    }

    loadCinematicConfig (config, cinematicConfig, stage, cinematic) {
        config.frames.forEach((frame) => {
            stage.add(
                new GUI.Image(frame, {x: -2000, y: 2000}, PIXI.Texture.fromFrame(frame))
            );
        })

        config.animations.forEach((animation) => {
            cinematicConfig.push(animation);
        })

        const music = cfg.music_offset !== undefined
            ? {
                name: cfg.music,
                offset: cfg.music_offset
            }
            : cfg.music;

        cinematic.setMusic(music);
        cinematic.hasLoaded();
    }

    loadSounds (config, speaker) {
        if (!config.length) {
            this._areSoundsLoaded = true;
            return;
        }

        const loaderContext = this;
        var ls = 0;

        function soundOnLoad () {
            ls += 1; //eslint-disable-line no-magic-numbers
            speaker.addSoundToLibrary(this.response, this.assetName);
            loaderContext._progressCb();
            if (ls === config.length) {
                loaderContext._areSoundsLoaded = true;
            }
        };

        config.forEach((sound) => {
            const request = new XMLHttpRequest();
            request.open("GET", sound.path, true);
            request.responseType = "arraybuffer";
            request.assetName = sound.name;
            request.onload = soundOnLoad;
            request.send();
        });
    }

    loadWinConditions (array, config) {
        config.forEach((winCondition) => {
            array.push(winCondition);
        })
    }

    /**
     * Method creates the elements from given config and injects them into given stage.
     * @param {object} stage Stage that you want inject elements into
     * @param {object} config Config file
     * @param {boolean} debug If this is true, boundary boxes will be showed
     */
    loadStageConfig (stage, config, isDebug = false) {
        const allTextures = PIXI.loader.resources.sprites.textures;
        const PLAYER_FRAMES = 5;

        config.forEach((entity) => {
            let element;
            switch (entity.type) {
                case "Background":
                    element = new Entities.Background(entity.id, allTextures[entity.texture], entity.factor);
                    break;
                case "Platform":
                    element = new Entities.Platform(entity.id, allTextures[entity.texture]);
                    break;
                case "Player":
                    const frames = [];
                    for (let frameCounter = 0; frameCounter < PLAYER_FRAMES; frameCounter++) {
                        frames.push(PIXI.loader.resources.walrus_atlas.textures['walrus_0000' + frameCounter]);
                    }
                    element = new Entities.Player(entity.id, frames);
                    break;
                case "BlockCoin":
                    element = new Entities.BlockCoin(entity.id, entity.quantity);
                    break;
                case "PositionField":
                    element = new Entities.PositionField(entity.id);
                    break;
                case "MovingPlatform":
                    element = new Entities.MovingPlatform(entity.id, allTextures[entity.texture], entity.startPos, entity.endPos, entity.time);
                    break;
                case "LasersFromGround":
                    element = new Entities.LasersFromGround(entity.id);
                    break;
                default: throw new Error(`No such type as: ${entity.type}`);
            }

            const small = window.innerWidth <= MOBILE_WIDTH ? MOBILE_FACTOR : DESKTOP_FACTOR;

            if (entity.rotation) element.setRotationAngle(entity.rotation);
            if (entity.anchor) element.setAnchor(entity.anchor);

            element.setPosition({
                x: entity.position.x / small,
                y: entity.position.y / small
            });

            stage.add(element);

            if (isDebug) {
                if (!element._data.anchor) element.debug_addBoundaryBox(new BoundaryBox(element.getPosition(), element.getSize()));
                else {
                    const pos = element.getPosition();
                    const size = element.getSize();
                    pos.x = pos.x - size.w * element._data.anchor.x;
                    pos.y = pos.y - size.h * element._data.anchor.y;
                    element.debug_addBoundaryBox(new BoundaryBox(pos, size, element._data.anchor));
                }
            }
        });
    }

    loadGUILayer (GUI_stage, Background_stage, config) {

        config.Background.children
            .map(configToElements)
            .forEach( (el) => {
                Background_stage.add(el);
            });

        config.GUI.children
            .map(configToElements)
            .forEach( (el) => {
                GUI_stage.add(el);
            });

        function configToElements ( object ) {
            let element;
            const small = window.innerWidth <= MOBILE_WIDTH ? MOBILE_FACTOR : DESKTOP_FACTOR;

            if (object.options && object.options.fontSize && object.options.fontFamily) {
                object.options.font = `${parseInt(object.options.fontSize) / small}px ${object.options.fontFamily}`;
            }

            const texture = object.texture ? PIXI.loader.resources.sprites.textures[object.texture] : null;

            switch (object.type) {
                case "Image":
                    element = new GUI.Image(object.id, object.position, texture);
                    break;
                case "Label":
                    element = new GUI.Label(object.id, object.position, object.text, object.options);
                    break;
                case "Button":
                    element = new GUI.Button(object.id, object.position, texture, object.text, object.options);
                    break;
                default:
                    throw new Error(`Bad type: ${object.type}`);
            }

            if (object.move) element.move(object.move);
            if (object.visible) element.display(object.visible);

            return element;
        }
    }
}
