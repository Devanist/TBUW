import React, {Component} from 'react';
import Spritesheet from '../../Gfx/sprites.json';
import GUI from '../../../GUI/GUI';

class GUIEditorMenu extends Component{

    constructor(){
        super();
        this.state = {
            url : "",
            expanded : "",
            inserting : false
        };
        this.expand = this.expand.bind(this);
    }

    render(){

        return <section id="EditorMenu">
            {this.state.inserting &&
                <section id="creationWindow">
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
                                {Object.keys(Spritesheet.frames).map(frame => <option key={frame} value={frame}>{frame}</option>)}
                            </select></td>
                        </tr>
                        <tr>
                            <td><input type="button" onClick={() => {
                                this.props.add({
                                    id : document.querySelector("#idSelection").value,
                                    type : document.querySelector("#typeSelection").value,
                                    texture : document.querySelector("#textureSelection").value
                                }, document.querySelector("#layerSelection").value);
                                this.setState({inserting : false});
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
                            <td><input type="button" value="Save" /></td>
                            <td><input type="button" value="New project" /></td>
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
                                <td>{`${elem.position.x}:${elem.position.y}`}</td>
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

}

export default GUIEditorMenu;