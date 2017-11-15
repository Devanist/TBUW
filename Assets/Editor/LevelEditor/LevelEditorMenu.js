import React, {Component} from 'react';

import Assets from '../../assets.json';
import WinConditions from '../../winConditions.json';
import SaveLink from '../common/SaveLink';
import CreationPopup from '../common/CreationPopup';
import InputElement from '../common/InputElement';

function WinConditionsTable (props) {
    const changeHandler = (e) => { props.updateWinConditions(name, e) };

    return (
        <table className={props.expanded !== "winconditions" && "hidden"}>
            <tbody>
                {
                    Object.keys(WinConditions).
                        map(wc => 
                            <tr key={wc}>
                                <td>
                                    {WinConditions[wc].label}
                                    <input 
                                        type="checkbox" 
                                        name={`${wc}_isActive`} 
                                        defaultChecked={false} 
                                        onChange={(e) => {props.toggleWinCondition(e, wc)}} 
                                    />
                                </td>
                                <td>
                                    {typeof WinConditions[wc].type !== "string"
                                        ? <table><tbody>
                                            {WinConditions[wc].type.map(sub => {
                                                return (
                                                    <tr key={`${wc}_${sub.name}`}>
                                                        <td>{sub.label}</td>
                                                        <td>{
                                                            <InputElement
                                                                type={sub.type}
                                                                defaultValue={sub.defaultValue}
                                                                name={sub.name}
                                                                isDisabled={props.isConditionTurnedOff(wc).result}
                                                                changeHandler={changeHandler}
                                                            />
                                                        }</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody></table>
                                        : <InputElement
                                            type={WinConditions[wc].type}
                                            defaultValue={WinConditions[wc].defaultValue}
                                            name={wc}
                                            isDisabled={props.isConditionTurnedOff(wc).result}
                                            changeHandler={changeHandler}
                                        />
                                    }
                                </td>
                            </tr>
                        )
                }
            </tbody>
        </table>
    );
}

class LevelEditorMenu extends Component {
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
        this.renderCreationPopup = this.renderCreationPopup.bind(this);
        this.addNewElementToScene = this.addNewElementToScene.bind(this);
        this.cancelCreation = this.cancelCreation.bind(this);
    }

    saveToFile(){
        const data = JSON.stringify(this.props.level);
        const linkData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(data);
        this.setState({
            url : linkData
        });
    }

    addNewElementToScene () {
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
    }

    cancelCreation () {
        this.setState({creation : false, warning : false});
    }

    render () {
        return <section id="EditorMenu">
            <CreationPopup
                creationStarted={this.state.creation}
                warning={this.state.warning}
                onAdd={this.addNewElementToScene}
                onCancel={this.cancelCreation}
            />
            <header>
                <input id="loadFile" type="file" onChange={this.props.load}/>
                <SaveLink url={this.props.url} />
                <table>
                    <tbody>
                        <tr>
                            <td><button value="Save level" onClick={this.saveToFile}/></td>
                            <td><button value="New level" onClick={this.props.reset}/></td>
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
                                <button
                                    value={this.props.musicPlaying && "Stop" || "Play"} 
                                    onClick={() => this.props.triggerMusic(this.props.musicPlaying)} 
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </header>
            <h3 onClick={() => {this.expand("winconditions")}}>Win conditions</h3>
            <WinConditionsTable
                expanded={this.state.expanded}
                toggleWinCondition={this.props.toggleWinCondition}
                isConditionTurnedOff={this.props.isConditionTurnedOff}
                updateWinConditions={this.props.updateWinConditions}
            />
            <h3 onClick={() => {this.expand("scene")}}>Scene</h3>
            <button
                value="Add new element to scene"
                onClick={() => {
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
                                <td><button value="X" title="Remove from scene" onClick={() => {this.props.remove(entity.id)}} /></td>
                                <td><button value="&#8593;" title="Move higher" onClick={() => {this.props.moveUp(entity.id)}} /></td>
                                <td><button value="&#8595;" title="Move lower" onClick={() => {this.props.moveDown(entity.id)}} /></td>
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
        if ( this.state.expanded === list ) list = "";

        this.setState({
            expanded : list
        });
    }
}

export default LevelEditorMenu;