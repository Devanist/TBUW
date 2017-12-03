import React, {Component} from 'react';

import SaveLink from '../common/SaveLink';
import EditorMenu from '../common/EditorMenu';
import ElementsList from '../common/ElementsList';

class GUIEditorMenu extends Component{

    constructor(){
        super();
        this.state = {
            url : "",
            expanded : "",
            creation : false,
            warning : ""
        };
        this.expand = this.expand.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.decorateWithProperties = this.decorateWithProperties.bind(this);
        this.addNewElementToScene = this.addNewElementToScene.bind(this);
        this.cancelCreation = this.cancelCreation.bind(this);
    }

    addNewElementToScene () {
        const id = document.querySelector("#idSelection").value;
        const layer = document.querySelector("#layerSelection").value;

        if(id === "" || this.props.contain(layer, id)){
            this.setState({
                warning : "ID can't be null or duplicate"
            });
        }
        else{

            let newElement = {
                id,
                type : document.querySelector("#typeSelection").value,
                texture : document.querySelector("#textureSelection").value
            };
            this.decorateWithProperties(newElement);
            this.props.add(newElement, layer);
            this.setState({inserting : false, warning : ""});
        }
    }

    cancelCreation () {
        this.setState({creation : false, warning : ""});
    }

    render(){

        return (
            <EditorMenu
                creationStarted={this.state.creation}
                warning={this.state.warning}
                onAdd={this.addNewElementToScene}
                onCancel={this.cancelCreation}
                GUI
            >
                <header>
                    <input id="loadFile" type="file" onChange={this.props.load}/>
                    <SaveLink url={this.state.url} />
                    <table>
                        <tbody>
                            <tr>
                                <td><button value="Save" onClick={this.saveFile}/></td>
                                <td><button value="New project" onClick={this.props.reset}/></td>
                            </tr>
                        </tbody>
                    </table>
                    <button
                        value="Add new element" 
                        onClick={() => {this.setState({inserting : true})}}
                    />
                    <h3 onClick={() => {this.expand("bglist")}}>Background</h3>
                    <ElementsList
                        expanded={this.state.expanded}
                        id="bg"
                        collection={this.props.bgList}
                        itemKey="bg"
                        select={(id) => {this.props.select("Background", id)}}
                    >
                        <button key="bg_firstButton" value="X" />
                        <button key="bg_secondButton" value="&#8593;" title="Move higher" />
                        <button key="bg_thirdButton" value="&#8595;" title="Move lower" />
                    </ElementsList>
                    <h3 onClick={() => {this.expand("guilist")}}>GUI</h3>
                    <ElementsList
                        expanded={this.state.expanded}
                        id="gui"
                        collection={this.props.guiList}
                        itemKey="gui"
                        select={(id) => {this.props.select("GUI", id)}}
                    >
                        <button key="gui_firstButton" value="X" />
                        <button key="gui_secondButton" value="&#8593;" title="Move higher" />
                        <button key="gui_thirdButton" value="&#8595;" title="Move lower" />
                    </ElementsList>
                </header>
            </EditorMenu>
        );
    }

    expand(list){
        if ( this.state.expanded === list ) list = "";

        this.setState({
            expanded : list
        });
    }

    saveFile(){
        this.setState({
            url : this.props.generate()
        });
    }

    decorateWithProperties(element){
        const props = GUI[element.type].Properties;

        Object.keys(props).forEach(prop => {
            if(props[prop].subFields === undefined){
                element[prop] = props[prop].defaultValue;
            }
            else{
                element[prop] = {};
                props[prop].subFields.forEach(subProp => {
                    element[prop][subProp.name] = subProp.defaultValue;
                });
            }
        });
    }

}

export default GUIEditorMenu;