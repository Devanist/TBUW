import Screen from '../Core/Screen';
import { getScreenFactor } from '../Core/Utils';

const MILISECONDS_BETWEEN_FRAMES = 16.666;
const INSTANT = 0;

export default class Cinematic extends Screen {
    constructor (params) {
        super();
        this._small = getScreenFactor();
        this._loaded = false;
        this._finished = false;
        this._beginTime = null;
        this._currentTime = 0;
        this._currentAnimationIndex = 0;
        this._stepCounter = 0;
        this._step = null;
        this._animatedObject = null;
        this._animationComplete = false;
        this._cinematicConfig = [];
        this._sounds = [];
        this._date = new Date();
        this._back = params.back;
    }

    hasLoaded () {
        this._loaded = true;
        this._cinematicConfig.forEach( (element) => {
            element.moveTo.x /= this._small;
            element.moveTo.y /= this._small;
        });
    }

    getConfig () {
        return this._cinematicConfig;
    }

    setMusic (sound) {
        sound.effect = "fadeIn";
        this._sounds.push(sound);
    }

    stepFadeOut () {
        this._stage._stage.alpha -= 0.01;
    }

    hasNotFadedOutYet () {
        return this._stage._stage.alpha > -1; //eslint-disable-line no-magic-numbers
    }

    returnToLevelChoosingScreen () {
        this._onUpdateAction = "CHANGE";
        this._nextScreen = "level_choose";
        this._nextScreenParams = {
            cfg: this._back
        };
    }

    countMovementStep (animatedObjectPosition, currentAnimation) {
        return {
            x: -(animatedObjectPosition.x - currentAnimation.moveTo.x) / currentAnimation.moveTo.time,
            y: -(animatedObjectPosition.y - currentAnimation.moveTo.y) / (currentAnimation.moveTo.time / MILISECONDS_BETWEEN_FRAMES)
        };
    }

    isAnimationFinished (currentAnimation) {
        return this._stepCounter >= currentAnimation.moveTo.time / MILISECONDS_BETWEEN_FRAMES;
    }

    completeAnimation (currentAnimation) {
        this._animatedObject.setPosition({x: currentAnimation.moveTo.x, y: currentAnimation.moveTo.y});
        this._animationComplete = true;
        this._beginTime = null;
        this._stepCounter = 0;
    }

    nextAnimation () {
        this._currentAnimationIndex++;
        this._animationComplete = false;
        this._step = null;
    }

    nextAnimationFrame () {
        if (this._stepCounter === 0) { //eslint-disable-line no-magic-numbers
            this._step = this.countMovementStep();
        }
        this._animatedObject.move(this._step);
        this._stepCounter++;
    }

    cinematicHasFinished () {
        return this._currentAnimationIndex === this._cinematicConfig.length;
    }

    playCinematicFrame () {
        if (this.cinematicHasFinished()) {
            this._finished = true;
            return;
        }

        const currentAnimation = this._cinematicConfig[this._currentAnimationIndex];
        this._animatedObject = this._stage.getElement(currentAnimation.id);

        if (!this._animationComplete) {
            if (currentAnimation.moveTo.time === INSTANT) {
                this.completeAnimation(currentAnimation);
            }
            else {
                this.nextAnimationFrame();
                if (this.isAnimationFinished(currentAnimation)) this.completeAnimation(currentAnimation);
            }
        }

        if (this._animationComplete === true) {
            if (currentAnimation.moveTo.wait === INSTANT) {
                this.nextAnimation();
            }
            else {
                if (!this._beginTime) this._beginTime = Date.now();

                this._currentTime = Date.now();
                const timeDiff = this._currentTime - this._beginTime;
                if (timeDiff >= currentAnimation.moveTo.wait) {
                    this.nextAnimation();
                }
            }
        }
    }

    update () {
        if (this._loaded) {
            if (!this._finished) {
                this.playCinematicFrame();
            }
            else {
                if (this.hasNotFadedOutYet()) {
                    this.stepFadeOut();
                }
                else {
                    this.returnToLevelChoosingScreen();
                }
            }
        }

        return {action: this._onUpdateAction, params: this._nextScreenParams, changeTo: this._nextScreen, playSound: this._sounds};
    };

}
