import Screen from '../Core/Screen';
import GUI from '../GUI/GUI';
import {render} from 'react-dom';
import React from 'react';

import appendEditorRootSection from '../Core/Utils/appendEditorRootSection';
import GUIEditorMain from '../Assets/Editor/GUIEditor/GUIEditorMain';

import style from '../Assets/Editor/editor.scss'; // eslint-disable-line no-unused-vars

export default class GUIEditor extends Screen {

    constructor () {
        super();

        this._stage.add(this._background);
        this._stage.add(this._guiStage);

        render(<GUIEditorMain editorContext={this} />, appendEditorRootSection());
    }

    update () {
        return { action: this._onUpdateAction, changeTo: this._nextScreen, playSound: [] };
    }

    updateStage (stage, list) {
        if (stage === "Background") {
            this._background.removeAll();
            list.forEach( (item) => {
                this._background.add(configToElements(item));
            });
        }
        else if (stage === "GUI") {
            this._guiStage.removeAll();
            list.forEach( (item) => {
                this._guiStage.add(configToElements(item));
            });
        }

        function configToElements (object) {
            const textures = PIXI.loader.resources.sprites.textures;
            const texture = object.texture ? textures[object.texture] : null;

            let element;

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
