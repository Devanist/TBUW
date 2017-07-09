import Screen from '../Core/Screen';
import Stage from '../Core/Stage';
import GUI from '../GUI/GUI';
import Spritesheet from '../Assets/Gfx/sprites.json';
import {render} from 'react-dom';
import React from 'react';

import GUIEditorMain from '../Assets/Editor/GUIEditor/GUIEditorMain';

import style from '../Assets/Editor/editor.scss';

class GUIEditor extends Screen{

    constructor(){
        super();

        this._stage.add(this._background);        
        this._stage.add(this._guiStage);

        let editorRoot = document.createElement('section');
        editorRoot.style.display = "inline-block";
        editorRoot.style.verticalAlign = "top";
        editorRoot.id = "editorRoot";
        document.body.appendChild(editorRoot);

        render(<GUIEditorMain editorContext={this} />, editorRoot);

    }

    update(keysState){
        return {action: this._onUpdateAction, changeTo: this._nextScreen, playSound: []};
    }

    updateStage(stage, list){

        if(stage === "Background"){
            this._background.removeAll();
            list.
                forEach( (item) => {
                    this._background.add(configToElements(item));
                });
        }
        else if(stage === "GUI"){
            this._guiStage.removeAll();
            list.
                forEach( (item) => {
                    this._guiStage.add(configToElements(item));
                });
        }

        function configToElements( obj ){

            let temp;

            let small = 1;
            if(window.innerWidth <= 640){
                small = 2;
            }

            let texture = null;
            if(obj.texture !== null && obj.texture !== undefined && obj.texture !== ""){
                texture = PIXI.Texture.fromFrame(obj.texture);
            }

            switch(obj.type){
                case "Image":
                    temp = new GUI.Image(obj.id, obj.position, texture);
                    console.log(obj.position);
                    break;
                case "Label":
                    temp = new GUI.Label(obj.id, obj.position, obj.text, obj.options);
                    break;
                case "Button":
                    temp = new GUI.Button(obj.id, obj.position, texture, obj.text, obj.options);
                    break;
                default: 
                    console.error(`Bad type: ${obj.type}`);
                    break;
            }
            if(obj.move){
                temp.move(obj.move);
            }
            if(obj.visible !== undefined && obj.visible !== null){
                temp.display(obj.visible);
            }
            return temp;

        }
    }

}

export default GUIEditor;