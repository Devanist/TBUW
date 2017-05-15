import React, {Component} from 'react';
import GUI from '../../../GUI/GUI';

import GUIEditorMenu from './GUIEditorMenu';
import GUIEditorProps from './GUIEditorProps';

class GUIEditorMain extends Component{

    constructor(){
        super();
        this.state = {
            project : {
                GUIElements : [],
                BackgroundElements : []
            }
        };
        this.addToScene = this.addToScene.bind(this);
    }

    render(){
        return <section id="GUIEditorMain">
            <GUIEditorMenu 
                guiList={this.state.project.GUIElements}
                bgList={this.state.project.BackgroundElements}
                add={this.addToScene}
            />
            <GUIEditorProps />
        </section>
    }

    addToScene(element, layer){
        
        element.position = {
            x : 0,
            y : 0
        };

        let guilist = this.state.project.GUIElements;
        let bglist = this.state.project.BackgroundElements;
        console.log(layer);
        if(layer === "gui"){
            guilist = [
                ...this.state.project.GUIElements,
                element
            ];
        }
        else{
            bglist = [
                ...this.state.project.BackgroundElements,
                element
            ];
        }

        this.setState({
            project : {
                GUIElements : guilist,
                BackgroundElements : bglist
            }
        });
    }

}

export default GUIEditorMain;