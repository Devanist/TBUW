import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Assets from '../../assets.json';
import Spritesheet from '../../Gfx/sprites.json';
import WinConditions from '../../winConditions.json';

import SaveLink from '../common/SaveLink';
import CreationPopup from '../common/CreationPopup';
import InputElement from '../common/InputElement';
import ElementsList from '../common/ElementsList';
import LoadFileButton from '../common/LoadFileButton';
import { dataToCSV } from '../common/Utils';

function WinConditionsTable (props) {
    const changeHandler = (e, name) => { props.updateWinConditions(name, e) };

    return (
        <table className={props.expanded !== "winconditions" && "hidden"}>
            <tbody>
                {Object.keys(WinConditions).map((conditionName) => {
                    const winCondition = WinConditions[conditionName];
                    return (
                        <tr key={conditionName}>
                            <td>
                                {winCondition.label}
                                <input
                                    type="checkbox"
                                    name={`${conditionName}_isActive`}
                                    defaultChecked={false}
                                    onChange={(e) => { props.toggleWinCondition(e, conditionName) }}
                                />
                            </td>
                            <td>
                                {typeof winCondition.type !== "string"
                                    ? <table><tbody>
                                        {winCondition.type.map((sub) => {
                                            return (
                                                <tr key={`${conditionName}_${sub.name}`}>
                                                    <td>{sub.label}</td>
                                                    <td>{
                                                        <InputElement
                                                            type={sub.type}
                                                            defaultValue={sub.defaultValue}
                                                            name={sub.name}
                                                            isDisabled={props.isConditionTurnedOff(conditionName).result}
                                                            changeHandler={(e) => { changeHandler(e, sub.name) }}
                                                        />
                                                    }</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody></table>
                                    : <InputElement
                                        type={winCondition.type}
                                        defaultValue={winCondition.defaultValue}
                                        name={conditionName}
                                        isDisabled={props.isConditionTurnedOff(conditionName).result}
                                        changeHandler={(e) => { changeHandler(e, conditionName) }}
                                    />
                                }
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
}

class LevelEditorMenu extends Component {
    constructor () {
        super();
        this.state = {
            expanded: "scene",
            creation: false,
            url: null,
            warning: ""
        }
        this.expand = this.expand.bind(this);
        this.saveToFile = this.saveToFile.bind(this);
        this.renderCreationPopup = this.renderCreationPopup.bind(this);
        this.addNewElementToScene = this.addNewElementToScene.bind(this);
        this.cancelCreation = this.cancelCreation.bind(this);
    }

    saveToFile () {
        this.setState({
            url: dataToCSV(this.props.level)
        });
    }

    addNewElementToScene () {
        const id = document.querySelector("#idSelection").value;
        if (id === "" || this.props.contain(id)) {
            this.setState({warning: "ID cannot be null or duplicate"});
        }
        else {
            this.props.add({
                id: document.querySelector("#idSelection").value,
                type: document.querySelector("#typeSelection").value,
                texture: document.querySelector("#textureSelection").value
            });
            this.setState({creation: false, warning: ""});
        }
    }

    cancelCreation () {
        this.setState({creation: false, warning: ""});
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
                <LoadFileButton onChange={this.props.load} />
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
                                    {Object.keys(Spritesheet.frames).map((asset) => <option key={`bg_${asset}`} value={asset}>{asset}</option>)}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Level music</td>
                            <td>
                                <select id="level_music" size="1" value={this.props.level.music} onChange={this.props.update}>
                                    <option value="none">Select music</option>
                                    {Assets.sounds.map((asset) => <option key={`sound_${asset.name}`} value={asset.name}>{asset.name}</option>)}
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
            <h3 onClick={() => { this.expand("winconditions") }}>Win conditions</h3>
            <WinConditionsTable
                expanded={this.state.expanded}
                toggleWinCondition={this.props.toggleWinCondition}
                isConditionTurnedOff={this.props.isConditionTurnedOff}
                updateWinConditions={this.props.updateWinConditions}
            />
            <h3 onClick={() => { this.expand("scene") }}>Scene</h3>
            <button
                value="Add new element to scene"
                onClick={() => {
                    this.props.clear();
                    this.setState({creation: true});
                }}
            />
            <section id="sceneElements">
                <ElementsList
                    expanded={this.state.expanded}
                    id="scene"
                    collection={this.props.level.entities}
                    itemKey="entity"
                    select={this.props.select}
                >
                    <button
                        value="X"
                        title="Remove from scene"
                        onClick={this.props.remove}
                        key="scene_firstButton"
                    />
                    <button
                        value="&#8593;"
                        title="Move higher"
                        onClick={this.props.moveUp}
                        key="scene_secondButton"
                    />
                    <button
                        value="&#8595;"
                        title="Move lower"
                        onClick={this.props.moveDown}
                        key="scene_secondButton"
                    />
                </ElementsList>
            </section>
        </section>
    }

    expand (list) {
        this.setState({
            expanded: this.state.expanded === list ? "" : list
        });
    }
}

LevelEditorMenu.propTypes = {
    moveDown: PropTypes.func.isRequired,
    moveUp: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    level: PropTypes.shape({
        entities: PropTypes.array
    }).isRequired,
    clear: PropTypes.func.isRequired,
    toggleWinCondition: PropTypes.func.isRequired,
    isConditionTurnedOff: PropTypes.func.isRequired,
    updateWinConditions: PropTypes.func.isRequired
};

export default LevelEditorMenu;
