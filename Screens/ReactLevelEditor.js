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
            this._background._elements[0]._sprite.texture = PIXI.loader.resources.sprites.textures[level.background[0].texture];
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