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
        this.isConditionTurnedOff = this.isConditionTurnedOff.bind(this);
        this.findType = this.findType.bind(this);
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
                isConditionTurnedOff={this.isConditionTurnedOff}
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
        if (!file) return;
        const editorContext = this;

        let reader = new FileReader();
        reader.onload = function(e){
            const content = e.target.result;
            editorContext.setState({
                level : JSON.parse(content)
            });
            editorContext.props.editorContext.updateStage("background", editorContext.state.level);
            editorContext.props.editorContext.updateStage("game", editorContext.state.level);
        };
        reader.readAsText(file);
    }

    addToScene(element){
        element.position = {
            x: 0,
            y: 0
        };
        
        const entityProperties = Entities[element.type].Properties;
        Object.keys(entityProperties).forEach(prop => {
            if(entityProperties[prop].subFields){
                element[prop] = {};
                entityProperties[prop].subFields.forEach(sub => {
                    element[prop][sub.name] = sub.defaultValue;
                });
            }
            else{
                element[prop] = entityProperties[prop].defaultValue;
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
        if(this.state.level.music === "") return;
        
        this.props.editorContext._sounds = stop
            ? [{
                name : this.state.level.music,
                stop : true
            }]
            : [{
                name : this.state.level.music,
                stop : this.state.musicPlaying
            }];

        this.setState({
            musicPlaying : !this.state.musicPlaying
        });
    }

    selectEntity(id){
        this.setState({
            selection : id
        });
    }

    removeFromScene(id){
        const entities = this.state.level.entities;
        const index = entities.findIndex(ent => ent.id === id);

        this.setState({
            level : {
                ...this.state.level,
                entities : [
                    ...entities.slice(0, index),
                    ...entities.slice(index + 1)
                ]
            }
        });
    }

    moveUp(id){
        const entities = this.state.level.entities;
        const index = entities.findIndex(ent => ent.id === id);

        this.setState({
            level : {
                ...this.state.level,
                entities : [
                    ...entities.slice(0, index - 1),
                    entities[index],
                    entities[index - 1],
                    ...entities.slice(index + 1)
                ]
            }
        });
    }

    moveDown(id){
        const entities = this.state.level.entities;
        const index = entities.findIndex(ent => ent.id === id);

        this.setState({
            level : {
                ...this.state.level,
                entities : [
                    ...entities.slice(0, index),
                    entities[index + 1],
                    entities[index],
                    ...entities.slice(index + 2)
                ]
            }
        });
    }

    contain(id){
        return this.state.level.entities.find(e => e.id === id) !== undefined;
    }

    updateWinConditions(name, event){
        const type = this.findType(name);
        const levelWinConditions = this.state.level.winConditions;
        let value;
        switch(type){
            case 'Number': value = parseInt(event.target.value); break;
            case 'String': value = event.target.value; break;
            case 'Boolean': value = event.target.checked; break;
            default: throw `Type not found: '${type}'`;
        }
        
        levelWinConditions.forEach((wc, index) => {
            if(wc.name === name){
                this.setState({
                    level: {
                        ...this.state.level,
                        winConditions: [
                            ...levelWinConditions.slice(0, index),
                            Object.assign({}, levelWinConditions[index], {value}),
                            ...levelWinConditions.slice(index + 1)
                        ]
                    }
                });
                return;
            }
            else if(typeof wc.value === "object"){
                Object.keys(wc.value).forEach(sub => {
                    if(sub === name){
                        this.setState({
                            level: {
                                ...this.state.level,
                                winConditions: [
                                    ...levelWinConditions.slice(0, index),
                                    Object.assign({}, levelWinConditions[index], 
                                        {
                                            value: {
                                                ...levelWinConditions[index].value,
                                                [sub]: value
                                            }
                                        }
                                    ),
                                    ...levelWinConditions.slice(index + 1)
                                ]
                            }
                        });
                        return;
                    }
                });
            }
        });

    }

    isConditionTurnedOff(conditionName){
        const toggledIndex = this.state.level.winConditions.findIndex(w => w.name === conditionName);
        return {result: toggledIndex === -1, value: toggledIndex};
    }

    findType(conditionName){
        let type;
        Object.keys(winConditions).forEach(key => {
            if(conditionName === key) {
                type = winConditions[key].type;
                return;
            }
            else if(Array.isArray(winConditions[key].type)){
                winConditions[key].type.forEach(sub => {
                    if(sub.name === conditionName) {
                        type = sub.type;
                        return;
                    }
                });
            }
        });
        if (!type) throw `Condition '${conditionName}' not found`;
        return type;
    }

    toggleWinCondition(event, winCondition){
        const {result: isConTurnedOff, value: toggledIndex} = this.isConditionTurnedOff(winCondition);
        const levelWinConditions = this.state.level.winConditions;

        if(isConTurnedOff) {
            this.setState({
                level: {
                    ...this.state.level,
                    winConditions: [
                        ...levelWinConditions,
                        {
                            name: winCondition,
                            value: winConditions[winCondition].defaultValue
                        }
                    ]
                }
            });
        }
        else {
            this.setState({
                level: {
                    ...this.state.level,
                    winConditions : [
                        ...levelWinConditions.splice(0, toggledIndex),
                        ...levelWinConditions.splice(toggledIndex + 1)
                    ]
                }
            });
        }
    }
}

export default LevelEditorMain;