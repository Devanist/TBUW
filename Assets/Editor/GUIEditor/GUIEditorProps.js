import React, {Component} from 'react';
import GUI from '../../../GUI/GUI';
import Spritesheet from '../../Gfx/sprites.json';
import InputElement from '../common/InputElement';

class GUIEditorProps extends Component{

    constructor() {
        super();
        this.renderInput = this.renderInput.bind(this);
        this.renderInputWithSubfields = this.renderInputWithSubfields.bind(this);
    }

    renderInput (entity, name) {
        const defaultValue = entity.type === "Boolean"
            ? (this.props.selection[prop] === undefined || this.props.selection[prop] === null) && entity.defaultValue || this.props.selection[prop]
            : this.props.selection[prop] || entity.defaultValue;

        return (
            <tr key={`prop_${entity.name}`}>
                <td>{entity.name}</td>
                <td>
                    <InputElement
                        type={entity.type}
                        defaultValue={defaultValue}
                        name={name}
                        onChange={this.props.update}
                    />
                </td>
            </tr>
        );
    }

    renderInputWithSubfields (entity, name) {
        return (
            <tr key={`prop_${entity.name}`}>
                <td>{entity.name}</td>
                <td>
                    <table><tbody>
                        {entity.subFields.map(sub => {
                            const defaultValue = sub.type === "Boolean"
                                ? (this.props.selection[prop][sub.name] === undefined || this.props.selection[prop][sub.name] === null) && sub.defaultValue || this.props.selection[prop][sub.name]
                                : this.props.selection[prop][sub.name] || sub.defaultValue;

                            return (
                                <tr key={`${entity.name}_${sub.name}`}>
                                    <td>{sub.name}</td>
                                    <td>
                                        <InputElement
                                            type={sub.type}
                                            name={`${name}_${sub.name}`}
                                            defaultValue={defaultValue}
                                            onChange={this.props.update}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody></table>
                </td>
            </tr>
        );
    }

    render(){
        const selection = this.props.selection;

        return <section id="EditorProps">
            {selection &&
                <section>
                    <section>
                        <button value="Clear selection" onClick={this.props.clear} />
                        <table><tbody>
                            <tr>
                                <td>Unique identifier:</td>
                                <td>
                                    <input id="props_id" type="text" name="props_id" defaultValue={selection.id} onChange={this.props.update}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Layer</td>
                                <td>
                                    <select id="props_layer" defaultValue={this.props.selectedLayer} onChange={this.props.update}>
                                        <option value="GUI">GUI</option>
                                        <option value="Background">Background</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Type</td>
                                <td><select id="props_type" defaultValue={selection.type} onChange={this.props.update}>
                                    {Object.keys(GUI).map(gui => <option key={gui} value={gui}>{gui}</option>)}
                                </select></td>
                            </tr>
                            <tr>
                                <td>Texture</td>
                                <td><select id="props_texture" defaultValue={selection.texture} onChange={this.props.update}>
                                    <option value="">none</option>
                                    {Object.keys(Spritesheet.frames).map(frame => <option key={frame} value={frame}>{frame}</option>)}
                                </select></td>
                            </tr>
                            <tr>
                                <td>String position: </td>
                                <td><input 
                                        id="positionChange"
                                        type="checkbox"
                                        defaultChecked={typeof selection.position === "string"}
                                        onClick={this.props.positionChange}    
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Position</td>
                                <td>
                                    {
                                        typeof selection.position === "string" ?
                                            <select id="positionString" name="position-string" onChange={this.props.update}>
                                                <option value="center">center</option>
                                                <option value="left-top">left-top</option>
                                            </select>
                                            : <p>
                                                <label>X : </label>
                                                <input id="props_position_x" type="number" defaultValue={selection.position.x} onChange={this.props.update}/>
                                                <br/>

                                                <label>Y : </label>
                                                <input id="props_position_y" type="number" defaultValue={selection.position.y} onChange={this.props.update}/>
                                            </p>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>Move</td>
                                <td>
                                    <label>X : </label>
                                    <input id="props_move_x" type="number" defaultValue={selection.move && selection.move.x || 0} onChange={this.props.update}/>
                                    <br/>

                                    <label>Y : </label>
                                    <input id="props_move_y" type="number" defaultValue={selection.move && selection.move.y || 0} onChange={this.props.update}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Visible</td>
                                <td>
                                    <input
                                        id="props_visible"
                                        type="checkbox"
                                        defaultChecked={(this.props.selection.visible === undefined && true) ||this.props.selection.visible }
                                        name="visible"
                                        onClick={this.props.update}
                                    />
                                </td>
                            </tr>
                        </tbody></table>
                    </section>
                    <section id="additionalProps">
                        <table><tbody>
                            {Object.keys(GUI[selection.type].Properties).map(prop => {
                                let entity = GUI[selection.type].Properties[prop];
                                entity.subFields
                                    ? renderInputWithSubfields(entity, prop)
                                    : renderInput(entity, prop);
                            })}
                        </tbody></table>
                    </section>
                </section>
            }
        </section>

    }

}

export default GUIEditorProps;