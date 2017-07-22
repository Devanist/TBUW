import Screen from '../Core/Screen';
import Stage from '../Core/Stage';
import Entities from '../Entities/Entities';

import Assets from '../Assets/assets.json';
import React, {Component} from 'react';
import {render} from 'react-dom';

import LevelEditorMain from '../Assets/Editor/LevelEditor/LevelEditorMain';

import style from '../Assets/Editor/editor.scss';

class LevelEditor extends Screen{

    constructor(){
        super();

        this._background = new Stage("background");
        this._background.add(new Entities.Background());
        this._gameStage = new Stage("game");
        
        this._stage.add(this._background);
        this._stage.add(this._gameStage);

        let editorRoot = document.createElement('section');
        editorRoot.style.display = "inline-block";
        editorRoot.style.verticalAlign = "top";
        editorRoot.id = "editorRoot";
        document.body.appendChild(editorRoot);
        
        this._musicPlaying = false;
        this._sounds = [];

        this._startClick = {
            x: 0,
            y: 0
        };

        this._buttonDown = false;

        document.querySelector("canvas").className = "editorCanvas";

        document.querySelector("canvas").addEventListener("mousedown", (e) => {
            if(e.button === 0){
                this._startClick.x = e.clientX;
                this._startClick.y = e.clientY;
                this._buttonDown = true;
            }
        });

        document.querySelector("canvas").addEventListener("mouseup", (e) => {
            this._buttonDown = false;
        });

        document.querySelector("canvas").addEventListener("mousemove", (e) => {
            if(this._buttonDown === true){
                this._gameStage.getStage().position.x += e.clientX - this._startClick.x;
                this._gameStage.getStage().position.y += e.clientY - this._startClick.y;
                this._startClick.x = e.clientX;
                this._startClick.y = e.clientY;
            }
        });

        document.querySelector("canvas").addEventListener("touchstart", (e) => {
            this._startClick.x = e.touches[0].clientX;
            this._startClick.y = e.touches[0].clientY;
            this._buttonDown = true;
        });

        document.querySelector("canvas").addEventListener("touchmove", (e) => {
            this._gameStage.getStage().position.x += e.touches[0].clientX - this._startClick.x;
            this._gameStage.getStage().position.y += e.touches[0].clientY - this._startClick.y;
            this._startClick.x = e.touches[0].clientX;
            this._startClick.y = e.touches[0].clientY;
        });

        render(<LevelEditorMain editorContext={this} />, editorRoot);
    }

    getMainStage(){
        return this._gameStage;
    }

    /**
     * Creates new, updated stage.
     * @param {string} stage
     */
    updateStage(stage, level){
        
        if(stage === "background"){
            this._background.removeAll();
            if(level.background[0].texture !== null){
                this._background.add(new Entities.Background(0, PIXI.loader.resources.sprites.textures[level.background[0].texture], 0));
            }
            else{
                this._background.add(new Entities.Background(0, null, 0));
            }
        }
        else if(stage === "game"){
            this._gameStage.removeAll();
            var e = null;
            var temp = null;
            for(var i = 0; i < level.entities.length; i+=1){
                e = level.entities[i];
                if(e !== undefined && e !== null){

                    if(e.type === "Background"){
                        temp = new Entities.Background(e.id, PIXI.Texture.fromFrame(e.texture), e.factor);
                    }
                    else if(e.type === "Platform"){
                        temp = new Entities.Platform(e.id, PIXI.Texture.fromFrame(e.texture));
                    }
                    else if(e.type === "Player"){
                        var frames = [];
                        for(var j = 0; j < 5; j+=1){
                            frames.push(PIXI.Texture.fromFrame('walrus_0000' + j));
                        }
                        temp = new Entities.Player(e.id, frames);
                    }
                    else if(e.type === "BlockCoin"){
                        temp = new Entities.BlockCoin(e.id, e.quantity);
                    }
                    else if(e.type === "PositionField"){
                        temp = new Entities.PositionField(e.id);
                    }
                    else if(e.type === "MovingPlatform"){
                        temp = new Entities.MovingPlatform(e.id, PIXI.Texture.fromFrame(e.texture), e.startPos, e.endPos, e.time);
                    }
                    else if(e.type === "LasersFromGround"){
                        temp = new Entities.LasersFromGround(e.id);
                    }
                    temp.setPosition(e.position);
                    if(e.anchor === undefined || e.anchor === null){
                        e.anchor = {
                            x: 0,
                            y: 0
                        };
                    }
                    temp.setAnchor(e.anchor);
                    temp.setRotationAngle(e.rotation);
                    this._gameStage.add(temp);
                }
            }
        }
    }

}

export default LevelEditor;