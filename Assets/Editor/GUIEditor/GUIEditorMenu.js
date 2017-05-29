import React, {Component} from 'react';
import Spritesheet from '../../Gfx/sprites.json';
import GUI from '../../../GUI/GUI';

class GUIEditorMenu extends Component{

    constructor(){
        super();
        this.state = {
            url : "",
            expanded : "",
            inserting : false,
            warning : ""
        };
        this.expand = this.expand.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.decorateWithProperties = this.decorateWithProperties.bind(this);
    }

    render(){

        return <section id="EditorMenu">
            {this.state.inserting &&
                <section id="creationWindow">
                    <p style={{color : "red"}}>{this.state.warning}</p>
                    <table><tbody>
                        <tr>
                            <td>Identifier</td>
                            <td><input id="idSelection" type="text" /></td>
                        </tr>
                        <tr>
                            <td>Layer</td>
                            <td>
                                <select id="layerSelection">
                                    <option value="GUI">GUI</option>
                                    <option value="Background">Background</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Type</td>
                            <td><select id="typeSelection">
                                {Object.keys(GUI).map(entity => <option key={entity} value={entity}>{entity}</option>)}
                            </select></td>
                        </tr>
                        <tr>
                            <td>Texture</td>
                            <td><select id="textureSelection">
                                <option value="">none</option>
                                {Object.keys(Spritesheet.frames).map(frame => <option key={frame} value={frame}>{frame}</option>)}
                            </select></td>
                        </tr>
                        <tr>
                            <td><input type="button" onClick={() => {

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
                            }} value="Add"/></td>
                            <td><input type="button" onClick={() => {this.setState({creation : false})}} value="Cancel" /></td>
                        </tr>
                    </tbody></table>
                </section>
            }
            <header>
                <input id="loadFile" type="file" onChange={this.props.load}/>
                {
                    this.state.url &&
                        <p><a href={this.state.url}>Right click here and select 'Save as'</a></p>
                }
                <table>
                    <tbody>
                        <tr>
                            <td><input type="button" value="Save" onClick={this.saveFile}/></td>
                            <td><input type="button" value="New project" onClick={this.props.reset}/></td>
                        </tr>
                    </tbody>
                </table>
                <input 
                    type="button" 
                    value="Add new element" 
                    onClick={() => {this.setState({inserting : true})}}
                />
                <h3 onClick={() => {this.expand("bglist")}}>Background</h3>
                <table className={this.state.expanded !== "bglist" && "hidden"}>
                    <thead>
                        <tr>
                            <td colSpan="3">Actions</td>
                            <td>ID</td>
                            <td>Type</td>
                            <td>Texture</td>
                            <td>Position</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.bgList.map(elem => 
                            <tr key={`gui_${elem.id}`}>
                                <td><input type="button" value="X" /></td>
                                <td><input type="button" value="&#8593;" title="Move higher" /></td>
                                <td><input type="button" value="&#8595;" title="Move lower" /></td>
                                <td className="entityIDcell" onClick={() => {this.props.select("Background", elem.id)}}>{elem.id}</td>
                                <td>{elem.type}</td>
                                <td>{elem.texture}</td>
                                <td>{`${elem.position.x}:${elem.position.y}`}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <h3 onClick={() => {this.expand("guilist")}}>GUI</h3>
                <table id="guiList" className={this.state.expanded !== "guilist" && "hidden"}>
                    <thead>
                        <tr>
                            <td colSpan="3">Actions</td>
                            <td>ID</td>
                            <td>Type</td>
                            <td>Texture</td>
                            <td>Position</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.guiList.map(elem => 
                            <tr key={`gui_${elem.id}`}>
                                <td><input type="button" value="X" /></td>
                                <td><input type="button" value="&#8593;" title="Move higher" /></td>
                                <td><input type="button" value="&#8595;" title="Move lower" /></td>
                                <td className="entityIDcell" onClick={() => {this.props.select("GUI", elem.id)}}>{elem.id}</td>
                                <td>{elem.type}</td>
                                <td>{elem.texture}</td>
                                <td>{
                                    typeof elem.position === "string" &&
                                    elem.position ||
                                    `${elem.position.x}:${elem.position.y}`
                                }</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </header>
        </section>

    }

    expand(list){
        if(this.state.expanded === list){
            list = "";
        }

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