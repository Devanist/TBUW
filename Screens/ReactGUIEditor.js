import Screen from '../Core/Screen';
import Stage from '../Core/Stage';
import GUI from '../GUI/GUI';
import Spritesheet from '../Assets/Gfx/sprites.json';
import {render} from 'react-dom';
import React from 'react';

import GUIEditorMain from '../Assets/Editor/GUIEditor/GUIEditorMain';

import style from '../Assets/Editor/editor.scss';

class ReactGUIEditor extends Screen{

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

    updateStage(stage){
        if(stage === "background"){

            this._background.removeAll();

            this._backgroundElements.
                map(configToElements).
                forEach( (item) => {
                    this._background.add(item);
                });
        }
        else if(stage === "gui"){

            this._guiStage.removeAll();

            this._guiElements.
                map(configToElements).
                forEach( (item) => {
                    this._guiStage.add(item);
                });
        }

        function configToElements( obj ){

            let temp;

            let small = 1;
            if(window.innerWidth <= 640){
                small = 2;
            }

            if(obj.options && obj.options.fontSize && obj.options.fontFamily){
                obj.options.font = `${parseInt(obj.options.fontSize)}px ${obj.options.fontFamily}`;
            }

            let texture = null;
            if(obj.texture !== null && obj.texture !== undefined && obj.texture !== ""){
                texture = PIXI.Texture.fromFrame(obj.texture);
            }

            switch(obj.type){
                case "image":
                    temp = new GUI.Image(obj.id, obj.position, texture);
                    break;
                case "label":
                    temp = new GUI.Label(obj.id, obj.position, obj.text, obj.options);
                    break;
                case "button":
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

export default ReactGUIEditor;