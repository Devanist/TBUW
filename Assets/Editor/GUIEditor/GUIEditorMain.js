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
        this.positionChange = this.positionChange.bind(this);
        this.generateFile = this.generateFile.bind(this);
        this.resetScene = this.resetScene.bind(this);
        this.contain = this.contain.bind(this);
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
                generate={this.generateFile}
                reset={this.resetScene}
                contain={this.contain}
            />
            <GUIEditorProps 
                selection={selected}
                selectedLayer={this.state.selected.layer}
                clear={this.clearSelection}
                positionChange={this.positionChange}
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
        let files = e.target;
        let file = e.target.files[0];
        if(!file){
            return;
        }
        const editorThis = this;

        let reader = new FileReader();
        reader.onload = function(e){
            const content = e.target.result;
            editorThis.setState({
                project : JSON.parse(content)
            });
            editorThis.props.editorContext.updateStage("background", editorThis.state.project.Background.children);
            editorThis.props.editorContext.updateStage("GUI", editorThis.state.project.GUI.children);
            files.value = null;
        }
        reader.readAsText(file);
    }

    generateFile(){
        return 'data:application/csv;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.state.project));
    }

    select(layer, id){

        this.clearSelection();

        setTimeout(() => {
            this.setState({
                selected : {
                    layer,
                    id
                }
            });
        }, 1);
    }

    clearSelection(){
        this.setState({
            selected : {
                layer : "",
                id : ""
            }
        });
    }

    positionChange(){

        let modifiedProject = {
            ...this.state.project
        };

        const index = this.state.project[this.state.selected.layer].children.findIndex(e => e.id === this.state.selected.id);

        if(typeof this.state.project[this.state.selected.layer].children[index].position === "object"){
            modifiedProject[this.state.selected.layer].children = [
                ...this.state.project[this.state.selected.layer].children.slice(0, index),
                Object.assign({}, this.state.project[this.state.selected.layer].children[index], {position : "center"}),
                ...this.state.project[this.state.selected.layer].children.slice(index + 1)
            ];
        }
        else{
            modifiedProject[this.state.selected.layer].children = [
                ...this.state.project[this.state.selected.layer].children.slice(0, index),
                Object.assign({}, this.state.project[this.state.selected.layer].children[index], {position : {x: 0, y: 0}}),
                ...this.state.project[this.state.selected.layer].children.slice(index + 1)
            ];
        }

        this.setState({
            project : modifiedProject
        });

        this.props.editorContext.updateStage("background", this.state.project.Background.children);
        this.props.editorContext.updateStage("GUI", this.state.project.GUI.children);
    }

    updateElement(){

        const layer = document.querySelector("#props_layer").value;

        let modifiedEntity = {
            id : document.querySelector("#props_id").value,
            type : document.querySelector("#props_type").value,
            texture : document.querySelector("#props_texture").value,
            move : {
                x : document.querySelector("#props_move_x").value,
                y : document.querySelector("#props_move_y").value
            },
            visible : document.querySelector("#props_visible").checked
        };

        if(document.querySelector("#positionChange").value === "true"){
            modifiedEntity.position = document.querySelector("#positionString").value;
        }
        else{
            modifiedEntity.position = {
                x : document.querySelector("#props_position_x").value,
                y : document.querySelector("#props_position_y").value
            };
        }

        if(GUI[modifiedEntity.type].Properties){
            Object.keys(GUI[modifiedEntity.type].Properties).forEach(prop => {
                if(GUI[modifiedEntity.type].Properties[prop].subFields){
                    modifiedEntity[prop] = {};
                    GUI[modifiedEntity.type].Properties[prop].subFields.forEach(sub => {
                        modifiedEntity[prop][sub.name] = document.querySelector(`#additionalProps input[name=${prop}_${sub.name}`).value;
                        if(sub.type === "Boolean"){
                            modifiedEntity[prop][sub.name] = document.querySelector(`#additionalProps input[name=${prop}_${sub.name}`).checked;
                        }
                        else if(sub.type === "Number"){
                            modifiedEntity[prop][sub.name] = parseInt(modifiedEntity[prop][sub.name]);
                        }
                    });
                }
                else{
                    modifiedEntity[prop] = document.querySelector(`#additionalProps input[name=${prop}]`).value
                }
            });
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
            console.log(this.state.selected.layer !== layer);
            let removedElement = modifiedProject[this.state.selected.layer].children.splice(index, 1)[0];
            modifiedProject[layer].children.push(removedElement);
        }

        this.setState({
            project : modifiedProject
        });

        this.props.editorContext.updateStage("background", this.state.project.Background.children);
        this.props.editorContext.updateStage("GUI", this.state.project.GUI.children);
        
    }

    resetScene(){
        this.setState({
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
        });

        setTimeout(() => {
            this.props.editorContext.updateStage("background", this.state.project.Background.children);
            this.props.editorContext.updateStage("GUI", this.state.project.GUI.children);
        }, 1);
    }

    contain(scene, id){
        return this.state.project[scene].children.find( element => element.id === id) !== undefined;
    }

}

export default GUIEditorMain;