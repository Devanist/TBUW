import React, {Component} from 'react';
import LevelEditorMenu from './LevelEditorMenu';
import LevelEditorProps from './LevelEditorProps';
import Entities from '../../../Entities/Entities';
import winConditions from '../../winConditions.json';

class LevelEditorMain extends Component{

    constructor(){
        super();
        this.state = {
            level : {
                name : "",
                music: "",
                background: [{}],
                winConditions: [
                    
                ],
                entities: []
            },
            selection : null,
            musicPlaying : false,
            mouse : {
                x : 0,
                y : 0
            }
        };
        this.loadLevel = this.loadLevel.bind(this);
        this.addToScene = this.addToScene.bind(this);
        this.resetEditor = this.resetEditor.bind(this);
        this.update = this.update.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
        this.triggerMusic = this.triggerMusic.bind(this);
        this.selectEntity = this.selectEntity.bind(this);
        this.removeFromScene = this.removeFromScene.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.contain = this.contain.bind(this);
        this.updateWinConditions = this.updateWinConditions.bind(this);
        this.toggleWinCondition = this.toggleWinCondition.bind(this);
    }

    render(){
        this.props.editorContext.updateStage("game", this.state.level);
        this.props.editorContext.updateStage("background", this.state.level);

        return <section id="Editor">
            <LevelEditorMenu
                level={this.state.level} 
                load={this.loadLevel} 
                reset={this.resetEditor} 
                update={this.update}
                triggerMusic={this.triggerMusic}
                add={this.addToScene} 
                musicPlaying={this.state.musicPlaying}
                select={this.selectEntity}
                remove={this.removeFromScene}
                moveDown={this.moveDown}
                moveUp={this.moveUp}
                clear={this.clearSelection}
                contain={this.contain}
                updateWinConditions={this.updateWinConditions}
                toggleWinCondition={this.toggleWinCondition}
            />
            <LevelEditorProps
                selection={this.state.level.entities.find(item => item.id === this.state.selection)}
                update={this.update}
                clear={this.clearSelection}
            />
        </section>
    }

    loadLevel(e){
        const file = e.target.files[0];
        if(!file){
            return;
        }
        const editorthis = this;

        let reader = new FileReader();
        reader.onload = function(e){
            const content = e.target.result;
            editorthis.setState({
                level : JSON.parse(content)
            });
            editorthis.props.editorContext.updateStage("background", editorthis.state.level);
            editorthis.props.editorContext.updateStage("game", editorthis.state.level);
        };
        reader.readAsText(file);
    }

    addToScene(element){

        element.position = {
            x: 0,
            y: 0
        };

        Object.keys(Entities[element.type].Properties).forEach(prop => {
            if(Entities[element.type].Properties[prop].subFields){
                element[prop] = {};
                Entities[element.type].Properties[prop].subFields.forEach(sub => {
                    element[prop][sub.name] = sub.defaultValue;
                });
            }
            else{
                element[prop] = Entities[element.type].Properties[prop].defaultValue;
            }
        });

        this.setState({
            level : {
                ...this.state.level,
                entities : [
                    ...this.state.level.entities,
                    element
                ]
            },
            selection : element.id
        });
    }

    resetEditor(){
        document.querySelector("#loadFile").value = null;
        document.querySelector("#level_background").value = "";

        this.setState({
            level : {
                name : "",
                music: "",
                background: [{}],
                winConditions: [
                    
                ],
                entities: []
            },
            selection : null
        });
    }

    clearSelection(){
        this.setState({
            selection : null
        });
    }

    update(){

        let entities = this.state.level.entities;
        if(this.state.selection !== null){
            const index = this.state.level.entities.findIndex(e => e.id === this.state.selection);
            let modifiedEntity = {
                id : document.querySelector("#props_id").value,
                type : document.querySelector("#props_type").value,
                texture : document.querySelector("#props_texture").value,
                position : {
                    x : document.querySelector("#props_position_x").value,
                    y : document.querySelector("#props_position_y").value
                }
            };

            if(Entities[modifiedEntity.type].Properties){
                Object.keys(Entities[modifiedEntity.type].Properties).forEach(prop => {
                    if(Array.isArray(Entities[modifiedEntity.type].Properties[prop])){
                        modifiedEntity[prop] = {};
                        Entities[modifiedEntity.type].Properties[prop].forEach(sub => {
                            modifiedEntity[prop][sub.name] = document.querySelector(`#additionalProps input[name=${prop}]`).value;
                        });
                    }
                    else{
                        modifiedEntity[prop] = document.querySelector(`#additionalProps input[name=${prop}]`).value;
                    }
                });
            }

            entities = [
                ...this.state.level.entities.slice(0, index),
                Object.assign(
                    {}, 
                    this.state.level.entities[index], 
                    modifiedEntity
                ),
                ...this.state.level.entities.slice(index + 1)
            ]
        }

        if(this.state.level.music !== document.querySelector("#level_music").value){
            this.triggerMusic(true);
        }

        this.setState({
            level : {
                ...this.state.level,
                name : document.querySelector("#level_title").value,
                winConditions: [
                    
                ],
                background : [
                    {
                        factor : 0,
                        id : 0,
                        position : {
                            x: 0,
                            y: 0
                        },
                        type : "Background",
                        texture : document.querySelector("#level_background").value !== "" && document.querySelector("#level_background").value || null
                    }
                ],
                music : document.querySelector("#level_music").value,
                entities
            }
        });

        this.props.editorContext.updateStage("game", this.state.level);
        this.props.editorContext.updateStage("background", this.state.level);

    }

    triggerMusic(stop){
        
        if(this.state.level.music !== ""){
            if(stop){
                this.props.editorContext._sounds = [{
                    name : this.state.level.music,
                    stop : true
                }];
            }
            else{
                this.props.editorContext._sounds = [{
                    name : this.state.level.music,
                    stop : this.state.musicPlaying
                }];
                
            }
            this.setState({
                musicPlaying : !this.state.musicPlaying
            });
        }
    }

    selectEntity(id){
        this.setState({
            selection : id
        });
    }

    removeFromScene(id){
        const index = this.state.level.entities.findIndex(ent => ent.id === id);

        this.setState({
            level : {
                ...this.state.level,
                entities : [
                    ...this.state.level.entities.slice(0, index),
                    ...this.state.level.entities.slice(index + 1)
                ]
            }
        });
    }

    moveUp(id){
        const index = this.state.level.entities.findIndex(ent => ent.id === id);

        this.setState({
            level : {
                ...this.state.level,
                entities : [
                    ...this.state.level.entities.slice(0, index - 1),
                    this.state.level.entities[index],
                    this.state.level.entities[index - 1],
                    ...this.state.level.entities.slice(index + 1)
                ]
            }
        });
    }

    moveDown(id){
        const index = this.state.level.entities.findIndex(ent => ent.id === id);

        this.setState({
            level : {
                ...this.state.level,
                entities : [
                    ...this.state.level.entities.slice(0, index),
                    this.state.level.entities[index + 1],
                    this.state.level.entities[index],
                    ...this.state.level.entities.slice(index + 2)
                ]
            }
        });
    }

    contain(id){
        return this.state.level.entities.find(e => e.id === id) !== undefined;
    }

    updateWinConditions(name, event){
        let winCon = winConditions[Object.keys(winConditions).find(key => key === name)] || 
            (() => {
                for(let key in winConditions){
                    if(winConditions.hasOwnProperty(key) && Array.isArray(winConditions[key].type)){
                        if(winConditions[key].type.find(sub => sub.name === name)) return sub;
                    }
                }
                throw 'Win condition not found';
            })();
        const type = winCon.type;
        let value;
        switch(type){
            case 'Number':
                value = parseInt(event.target.value);
            case 'String':
                value = event.target.value;
            case 'Boolean':
                value = event.target.checked;
        }
        winCon = Object.assign({}, winCon, {value});
    }

    toggleWinCondition(event, winCondition){
        let toggledIndex = this.state.level.winConditions.findIndex(w => w.name === winCondition);
        if(toggledIndex > -1){
            this.setState({
                level: {
                    ...this.state.level,
                    winConditions : [
                        ...this.state.level.winConditions.splice(0, toggledIndex),
                        ...this.state.level.winConditions.splice(toggledIndex + 1)
                    ]
                }
            })
        }
        else{
            this.setState({
                level: {
                    ...this.state.level,
                    winConditions: [
                        ...this.state.level.winConditions,
                        {
                            name: winCondition,
                            value: winConditions[winCondition].defaultValue
                        }
                    ]
                }
            })
        }
    }
}

export default LevelEditorMain;