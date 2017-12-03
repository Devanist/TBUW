import PropTypes from 'prop-types';
import React, {Component} from 'react';
import GUI from '../../../GUI/GUI';

import GUIEditorMenu from './GUIEditorMenu';
import GUIEditorProps from './GUIEditorProps';
import { dataToCSV } from '../common/Utils';

const FILE = 0;

export default class GUIEditorMain extends Component {
    constructor () {
        super();
        this.state = {
            project: {
                GUI: {
                    children: []
                },
                Background: {
                    children: []
                },
            },
            selected: {
                layer: "",
                id: ""
            }
        };
        this.addToScene = this.addToScene.bind(this);
        this.loadFromFile = this.loadFromFile.bind(this);
        this.select = this.select.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
        this.updateElement = this.updateElement.bind(this);
        this.positionChange = this.positionChange.bind(this);
        this.generateFile = this.generateFile.bind(this);
        this.resetScene = this.resetScene.bind(this);
        this.contain = this.contain.bind(this);
    }

    render () {
        const selectedElement = this.state.project[this.state.selected.layer].children.find((element) => element.id === this.state.selected.id);

        return (
            <section id="GUIEditorMain">
                <GUIEditorMenu
                    guiList={this.state.project.GUI.children}
                    bgList={this.state.project.Background.children}
                    load={this.loadFromFile}
                    add={this.addToScene}
                    select={this.select}
                    generate={this.generateFile}
                    reset={this.resetScene}
                    contain={this.contain}
                />
                <GUIEditorProps
                    selection={selectedElement}
                    selectedLayer={this.state.selected.layer}
                    clear={this.clearSelection}
                    positionChange={this.positionChange}
                    update={this.updateElement}
                />
            </section>
        )
    }

    addToScene (element, layer) {

        element.position = {
            x: 0,
            y: 0
        };

        const modifiedProject = {
            ...this.state.project
        };

        modifiedProject[layer].children = [
            ...this.state.project[layer].children,
            element
        ];

        this.setState({
            project: modifiedProject,
            selected: {
                layer,
                id: element.id
            }
        });
    }

    loadFromFile (e) {
        const files = e.target;
        const file = e.target.files[FILE];
        if (!file) return;

        const editorThis = this;

        const reader = new FileReader();
        reader.onload = function (event) {
            const content = event.target.result;
            editorThis.setState({
                project: JSON.parse(content)
            });
            editorThis.props.editorContext.updateStage("background", editorThis.state.project.Background.children);
            editorThis.props.editorContext.updateStage("GUI", editorThis.state.project.GUI.children);
            files.value = null;
        }
        reader.readAsText(file);
    }

    generateFile () {
        return dataToCSV(this.state.project);
    }

    select (layer, id) {
        this.clearSelection();

        setTimeout(() => {
            this.setState({
                selected: {
                    layer,
                    id
                }
            });
        }, 1); // eslint-disable-line no-magic-numbers
    }

    clearSelection () {
        this.setState({
            selected: {
                layer: "",
                id: ""
            }
        });
    }

    positionChange () {
        const modifiedProject = {
            ...this.state.project
        };

        const layer = this.state.selected.layer;
        const index = this.state.project[layer].children.findIndex((child) => child.id === this.state.selected.id);
        const children = this.state.project[layer].children;

        const position = typeof children[index].position === "object" ? "center" : { x: 0, y: 0 };
        modifiedProject[layer].children = [
            ...children.slice(0, index), //eslint-disable-line no-magic-numbers
            Object.assign({}, children[index], {position}),
            ...children.slice(index + 1) //eslint-disable-line no-magic-numbers
        ];

        this.setState({
            project: modifiedProject
        });

        this.props.editorContext.updateStage("background", this.state.project.Background.children);
        this.props.editorContext.updateStage("GUI", this.state.project.GUI.children);
    }

    updateElement () {
        const layer = document.querySelector("#props_layer").value;

        const modifiedEntity = {
            id: document.querySelector("#props_id").value,
            type: document.querySelector("#props_type").value,
            texture: document.querySelector("#props_texture").value,
            move: {
                x: parseInt(document.querySelector("#props_move_x").value),
                y: parseInt(document.querySelector("#props_move_y").value)
            },
            visible: document.querySelector("#props_visible").checked
        };

        modifiedEntity.position = document.querySelector("#positionChange").value === "true"
            ? document.querySelector("#positionString").value
            : {
                x: parseInt(document.querySelector("#props_position_x").value),
                y: parseInt(document.querySelector("#props_position_y").value)
            };

        const type = modifiedEntity.type;
        const properties = GUI[type].Properties;

        if ( properties ) {
            Object.keys(properties).forEach((prop) => {
                if (properties[prop].subFields) {
                    modifiedEntity[prop] = {};
                    properties[prop].subFields.forEach((sub) => {
                        modifiedEntity[prop][sub.name] = document.querySelector(`#additionalProps input[name=${prop}_${sub.name}`).value;
                        if (sub.type === "Boolean") {
                            modifiedEntity[prop][sub.name] = document.querySelector(`#additionalProps input[name=${prop}_${sub.name}`).checked;
                        }
                        else if (sub.type === "Number") {
                            modifiedEntity[prop][sub.name] = parseInt(modifiedEntity[prop][sub.name]);
                        }
                    });
                }
                else {
                    modifiedEntity[prop] = document.querySelector(`#additionalProps input[name=${prop}]`).value
                }
            });
        }

        const modifiedProject = {
            ...this.state.project
        };

        const selectedLayer = this.state.selected.layer;
        const index = modifiedProject[selectedLayer].children.findIndex((child) => child.id === this.state.selected.id);

        modifiedProject[selectedLayer].children = [
            ...modifiedProject[selectedLayer].children.slice(0, index), //eslint-disable-line no-magic-numbers
            Object.assign({}, modifiedProject[selectedLayer].children[index], modifiedEntity),
            ...modifiedProject[selectedLayer].children.slice(index + 1) //eslint-disable-line no-magic-numbers
        ];

        if (selectedLayer !== layer) {
            const removedElement = modifiedProject[selectedLayer].children.splice(index, 1)[0]; //eslint-disable-line no-magic-numbers
            modifiedProject[layer].children.push(removedElement);
        }

        this.setState({
            project: modifiedProject
        });

        this.props.editorContext.updateStage("background", this.state.project.Background.children);
        this.props.editorContext.updateStage("GUI", this.state.project.GUI.children);
    }

    resetScene () {
        this.setState({
            project: {
                GUI: {
                    children: []
                },
                Background: {
                    children: []
                },
            },
            selected: {
                layer: "",
                id: ""
            }
        });

        setTimeout(() => {
            this.props.editorContext.updateStage("background", this.state.project.Background.children);
            this.props.editorContext.updateStage("GUI", this.state.project.GUI.children);
        }, 1); //eslint-disable-line no-magic-numbers
    }

    contain (scene, id) {
        return this.state.project[scene].children.find( (element) => element.id === id) !== undefined;
    }

}

GUIEditorMain.propTypes = {
    editorContext: PropTypes.shape()
};
