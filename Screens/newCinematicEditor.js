import React from 'react';
import { render } from 'react-dom';

import GUI from '../GUI/GUI';
import Screen from '../Core/Screen';
import appendEditorRootSection from '../Core/Utils/appendEditorRootSection';
import CinematicEditorMain from '../Assets/Editor/CinematicEditor/CinematicEditorMain';

import style from '../Assets/Editor/editor.scss'; // eslint-disable-line no-unused-vars

const ANIMATED_OBJECT_INITIAL_POSITION = {x: -2000, y: -2000};
const NOT_VISIBLE = -1;
const FIRST_FRAME = 0;
const TIME_INTERVAL = 16.6;
const IMMEDIATE_TIME = 0;
const FADING_STEP = 0.01;

export default class CinematicEditor extends Screen {
    constructor () {
        super();

        this._sounds = [];
        this._musicPlaying = false;

        this._play = false;

        this._sceneFinished = false;
        this._currentPlayingAnimationIndex = 0;
        this._stepCounter = 0;
        this._animationComplete = false;
        this._animatedObject = null;
        this._startTime = 0;
        this._totalTime = 0;

        render((
            <CinematicEditorMain
                updateStage={this.updateStage}
                countTotalTime={this.countTotalTime}
            />
        ), appendEditorRootSection());
    }

    update () {
        const MS_IN_MINUTE = 60000;
        const SEC_IN_MINUTE = 1000;

        const soundsToPlay = [...this._sounds]
        this._sounds = [];

        if (this._play) {
            this.play();
            document.querySelector("#timeScreen").textContent = '';
        }

        if (this._musicPlaying) {
            let seconds = Date.now() - this._startTime;
            const minutes = parseInt(seconds / MS_IN_MINUTE);
            seconds = parseInt((seconds - MS_IN_MINUTE * minutes) / SEC_IN_MINUTE);
            document.querySelector("#timeScreen").textContent = `${minutes}:${seconds}`;
        }

        return {action: this._onUpdateAction, params: this._nextScreenParams, changeTo: this._nextScreen, playSound: soundsToPlay};
    }

    updateStage (script) {
        this._stage.removeAll();
        script.frames.forEach(this.addToStage);
    }

    addToStage (frame) {
        const textures = PIXI.loader.resources.sprites.textures;
        this._stage.add(new GUI.Image(frame, {x: -2000, y: -2000}, textures[frame]));
    }

    play () {
        if (this._sceneFinished) {
            const FADING_NOT_COMPLETE = this._stage._stage.alpha > NOT_VISIBLE;

            if (FADING_NOT_COMPLETE) this.fadeOut();
            else this.resetPlayer();
        }
        else {
            const WAS_PREVIOUS_ANIMATION_THE_LAST = this._currentPlayingAnimationIndex === this._config.animations.length;

            if (WAS_PREVIOUS_ANIMATION_THE_LAST) this._finished = true;
            else {
                this.playNextAnimation();
            }
        }
    }

    playNextAnimation () {
        const currentAnimation = this._config.animations[this._currentPlayingAnimationIndex];
        this._animatedObject = this._stage.getElement(currentAnimation.id);
        if (this._animationComplete) {
            if (shouldAnimationBeFiredImmediate(currentAnimation)) this.stepToNextAnimation();
            else {
                if (!this._beginTime) this._beginTime = Date.now();

                const timeDiff = Date.now() - this._beginTime;
                const HAS_WAIT_ENDED = timeDiff >= currentAnimation.moveTo.wait;
                if (HAS_WAIT_ENDED) this.stepToNextAnimation();
            }
        }
        else {
            if (isAnimationImmediate(currentAnimation)) {
                this._animatedObject.setPosition({
                    x: currentAnimation.moveTo.x,
                    y: currentAnimation.moveTo.y
                });
                this.finishAnimation();
            }
            else {
                this.playNextFrame(currentAnimation);
            }
        }
    }

    playNextFrame (currentAnimation) {
        const IS_FIRST_ANIMATION_FRAME = this._stepCounter === FIRST_FRAME;
        if (IS_FIRST_ANIMATION_FRAME) this.setStep();

        this._animatedObject.move(this._step);
        this._stepCounter++;

        const IS_LAST_FRAME = this._stepCounter >= currentAnimation.moveTo.time / TIME_INTERVAL;
        if (IS_LAST_FRAME) {
            this.fixFrame();
            this.finishAnimation();
        }
    }

    resetPlayer () {
        document.querySelector("#play").textContent = "Play";
        document.querySelector("#timeBar").value = 0;
        this._stage._elements.forEach((item) => {
            item.setPosition(ANIMATED_OBJECT_INITIAL_POSITION);
        });

        this._sceneFinished = false;
        this._currentPlayingAnimationIndex = 0;
        this._stepCounter = 0;
        this._animationComplete = false;
        this._animatedObject = null;
        this._play = false;
    }

    fadeOut () {
        this._stage._stage.alpha -= FADING_STEP;
    }

    setStep (currentAnimation) {
        const animatedObjectPosition = this._animatedObject.getPosition();
        this._step = {
            x: -(animatedObjectPosition.x - currentAnimation.moveTo.x) / currentAnimation.moveTo.time,
            y: -(animatedObjectPosition.y - currentAnimation.moveTo.y) / (currentAnimation.moveTo.time / TIME_INTERVAL)
        };
    }

    stepToNextAnimation () {
        this._currentPlayingAnimationIndex++;
        this._animationComplete = false;
        this._step = 0;
    }

    fixFrame (currentAnimation) {
        this._animatedObject.setPosition({
            x: currentAnimation.moveTo.x,
            y: currentAnimation.moveTo.y
        });
    }

    finishAnimation () {
        this._animationComplete = true;
        this._beginTime = 0;
        this._stepCounter = 0;
    }

    countTotalTime () {
        const { animations } = this._config;
        for (const item in animations) {
            this._maxTime += animations[item].moveTo.time + animations[item].moveTo.wait;
        }
    }
}

function isAnimationImmediate (animation) {
    return animation.moveTo.time === IMMEDIATE_TIME;
}

function shouldAnimationBeFiredImmediate (currentAnimation) {
    return currentAnimation.moveTo.wait === IMMEDIATE_TIME;
}
