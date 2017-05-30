import Entities from '../../../Entities/Entities';
import Spritesheet from '../../Gfx/sprites.json';
import Assets from '../../assets.json';
import WinConditions from '../../winConditions.json';

import React, {Component} from 'react';

class LevelEditorMenu extends Component{

    constructor(){
        super();
        this.state = {
            expanded : "scene",
            creation : false,
            url : null,
            warning : ""
        }
        this.expand = this.expand.bind(this);
        this.saveToFile = this.saveToFile.bind(this);
    }

    saveToFile(){
        const data = JSON.stringify(this.props.level);
        const linkData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(data);
        this.setState({
            url : linkData
        });
    }

    render(){
        return <section id="EditorMenu">
            {this.state.creation && 
                <section id="creationWindow">
                    <p style={{color : "red"}}>{this.state.warning}</p>
                    <table><tbody>
                        <tr>
                            <td>Identifier</td>
                            <td><input id="idSelection" type="text" /></td>
                        </tr>
                        <tr>
                            <td>Type</td>
                            <td><select id="typeSelection">
                                {Object.keys(Entities).map(entity => <option key={entity} value={entity}>{entity}</option>)}
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
                                const id = document.querySelector("#idSelection").value;
                                if(id === "" || this.props.contain(id)){
                                    this.setState({warning : "ID cannot be null or duplicate"});
                                }
                                else{
                                    this.props.add({
                                        id : document.querySelector("#idSelection").value,
                                        type : document.querySelector("#typeSelection").value,
                                        texture : document.querySelector("#textureSelection").value
                                    });
                                    this.setState({creation : false, warning : ""});
                                }
                            }} value="Add"/></td>
                            <td><input type="button" onClick={() => {this.setState({creation : false, warning : false})}} value="Cancel" /></td>
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
                            <td><input type="button" value="Save level" onClick={this.saveToFile}/></td>
                            <td><input type="button" value="New level" onClick={this.props.reset}/></td>
                        </tr>
                        <tr>
                            <td>Level title</td>
                            <td><input id="level_title" type="text" value={this.props.level.name} onChange={this.props.update}/></td>
                        </tr>
                        <tr>
                            <td>Level background</td>
                            <td>
                                <select 
                                    id="level_background" 
                                    defaultValue="" 
                                    size="1" 
                                    onChange={this.props.update}
                                >
                                    <option value="">Select background</option>
                                    {Object.keys(Spritesheet.frames).map(asset => <option key={`bg_${asset}`} value={asset}>{asset}</option>)}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Level music</td>
                            <td>
                                <select id="level_music" size="1" value={this.props.level.music} onChange={this.props.update}>
                                    <option value="none">Select music</option>
                                    {Assets.sounds.map(asset => <option key={`sound_${asset.name}`} value={asset.name}>{asset.name}</option>)}
                                </select>
                            </td>
                            <td>
                                <input  type="button" 
                                        value={this.props.musicPlaying && "Stop" || "Play"} 
                                        onClick={() => this.props.triggerMusic(this.props.musicPlaying)} 
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </header>
            <h3 onClick={() => {this.expand("winconditions")}}>Win conditions</h3>
            <table className={this.state.expanded !== "winconditions" && "hidden"}>
                <tbody>
                    {
                        Object.keys(WinConditions).
                        map(wc => 
                            <tr key={wc}>
                                <td>{WinConditions[wc].label}</td>
                                <td>
                                    {typeof WinConditions[wc].type !== "string" &&
                                        <table><tbody>
                                            {WinConditions[wc].type.map(sub => {
                                                return <tr key={`${wc}_${sub.name}`}>
                                                    <td>{sub.label}</td>
                                                    <td>{
                                                        this.typeToElement(sub, sub)
                                                    }</td>
                                                </tr>}
                                            )}
                                        </tbody></table> ||
                                        this.typeToElement(WinConditions[wc], wc)
                                    }
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            <h3 onClick={() => {this.expand("scene")}}>Scene</h3>
            <input type="button" value="Add new element to scene" onClick={() => {
                        this.props.clear();
                        this.setState({creation : true});
                    }
                } 
            />
            <section id="sceneElements">
                <table className={this.state.expanded !== "scene" && "hidden"}>
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
                        {this.props.level.entities.length === 0 && <tr><td>Scene is empty</td></tr> || this.props.level.entities.map((entity, index) => 
                            <tr key={`entity_${index}`} >
                                <td><input type="button" value="X" title="Remove from scene" onClick={() => {this.props.remove(entity.id)}} /></td>
                                <td><input type="button" value="&#8593;" title="Move higher" onClick={() => {this.props.moveUp(entity.id)}} /></td>
                                <td><input type="button" value="&#8595;" title="Move lower" onClick={() => {this.props.moveDown(entity.id)}} /></td>
                                <td className="entityIDcell" onClick={() => {this.props.select(entity.id)}}>{entity.id}</td>
                                <td>{entity.type}</td>
                                <td>{entity.texture}</td>
                                <td>{`${entity.position.x}:${entity.position.y}`}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
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

    typeToElement(condition, name){
        switch(condition.type){
            case "Number" : 
                return <input name={name} type="number" defaultValue="0" />;
            case "Text" : 
                return <input name={name} type="text" defaultValue="" />;
            case "Boolean" :
                return <input name={name} type="checkbox" defaultChecked="false" />
            default:
                console.error("No such input type");
        }
    }

}

export default LevelEditorMenu;