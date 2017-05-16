import Entities from '../../../Entities/Entities';
import Spritesheet from '../../Gfx/sprites.json';
import Assets from '../../assets.json';

import React, {Component} from 'react';

class LevelEditorMenu extends Component{

    constructor(){
        super();
        this.state = {
            expanded : "scene",
            creation : false,
            url : null
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
                                this.props.add({
                                    id : document.querySelector("#idSelection").value,
                                    type : document.querySelector("#typeSelection").value,
                                    texture : document.querySelector("#textureSelection").value
                                });
                                this.setState({creation : false});
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
                                <select id="level_background" defaultValue="none" size="1" onClick={this.props.update}>
                                    <option disabled value="none">Select background</option>
                                    {Object.keys(Spritesheet.frames).map(asset => <option key={`bg_${asset}`} value={asset}>{asset}</option>)}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Level music</td>
                            <td>
                                <select id="level_music" size="1" value={this.props.level.music} onChange={this.props.update}>
                                    <option disabled value="none">Select music</option>
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
                    <tr>
                    
                    </tr>
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

}

export default LevelEditorMenu;