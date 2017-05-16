import React, {Component} from 'react';
import GUI from '../../../GUI/GUI';

import GUIEditorMenu from './GUIEditorMenu';
import GUIEditorProps from './GUIEditorProps';

class GUIEditorMain extends Component{

    constructor(){
        super();
        this.state = {
            project : {
                GUI : {
                    children : []
                },
                Background : {
                    children : []
                },
            },
            selected : {
                layer : "",
                id : ""
            }
        };
        this.addToScene = this.addToScene.bind(this);
        this.loadFromFile = this.loadFromFile.bind(this);
        this.select = this.select.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
        this.updateElement = this.updateElement.bind(this);
    }

    render(){

        let selected;
        if(this.state.selected.layer === "GUI"){
            selected = this.state.project.GUI.children.find(element => element.id === this.state.selected.id);
        }
        else if(this.state.selected.layer === "Background"){
            selected = this.state.project.Background.children.find(element => element.id === this.state.selected.id);
        }

        return <section id="GUIEditorMain">
            <GUIEditorMenu 
                guiList={this.state.project.GUI.children}
                bgList={this.state.project.Background.children}
                load={this.loadFromFile}
                add={this.addToScene}
                select={this.select}
            />
            <GUIEditorProps 
                selection={selected}
                selectedLayer={this.state.selected.layer}
                clear={this.clearSelection}
                update={this.updateElement}
            />
        </section>
    }

    addToScene(element, layer){
        
        element.position = {
            x : 0,
            y : 0
        };

        let modifiedProject = {
            ...this.state.project
        };

        modifiedProject[layer].children = [
            ...this.state.project[layer].children,
            element
        ];

        this.setState({
            project : modifiedProject,
            selected : {
                layer,
                id : element.id
            }
        });
    }

    loadFromFile(e){
        const file = e.target.files[0];
        if(!file){
            return;
        }
        const editorThis = this;

        let reader = new FileReader();
        reader.onload = function(e){
            const content = e.target.result;
            console.log(content);
            editorThis.setState({
                project : JSON.parse(content)
            });
            editorThis.props.editorContext.updateStage("background", editorThis.state.project.Background.children);
            editorThis.props.editorContext.updateStage("GUI", editorThis.state.project.GUI.children);
        }
        reader.readAsText(file);
    }

    select(layer, id){
        this.setState({
            selected : {
                layer,
                id
            }
        });
    }

    clearSelection(){
        this.select("", "");
    }

    updateElement(){

        const layer = document.querySelector("#props_layer").value;

        let modifiedEntity = {
            id : document.querySelector("#props_id").value,
            type : document.querySelector("#props_type").value,
            texture : document.querySelector("#props_texture").value,
            position : {
                x : document.querySelector("#props_position_x").value,
                y : document.querySelector("#props_position_y").value
            }
        }

        let modifiedProject = {
            ...this.state.project
        };

        const index = modifiedProject[this.state.selected.layer].children.findIndex(e => e.id === this.state.selected.id);

        modifiedProject[this.state.selected.layer].children = [
            ...modifiedProject[this.state.selected.layer].children.slice(0, index),
            Object.assign({}, modifiedProject[this.state.selected.layer].children[index], modifiedEntity),
            ...modifiedProject[this.state.selected.layer].children.slice(index + 1)
        ];

        if(this.state.selected.layer !== layer){
            let removedElement = modifiedProject[this.state.selected.layer].children.splice(index, 1)[0];

            modifiedProject[layer].children.push(removedElement);
        }

        this.setState({
            project : modifiedProject
        });

        this.props.editorContext.updateStage("background", this.state.project.Background.children);
        this.props.editorContext.updateStage("GUI", this.state.project.GUI.children);
        
    }

}

export default GUIEditorMain;