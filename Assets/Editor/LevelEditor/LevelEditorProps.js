import React, {Component} from 'react';
import Entities from '../../../Entities/Entities';
import Spritesheet from '../../Gfx/sprites.json';
import InputElement from '../common/InputElement';

function MainProps (props) {
    if (!props.selection) return null;
    
    return (
        <section>
            <button value="Clear selection" onClick={props.clear} />
            <table><tbody>
                <tr>
                    <td>Unique identifier:</td>
                    <td>
                        <input
                            id="props_id"
                            type="text"
                            name="props_id"
                            defaultValue={props.selection.id}
                            onChange={props.update}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Type</td>
                    <td>
                        <select
                            id="props_type"
                            defaultValue={props.selection.type}
                            onChange={props.update}
                        >
                            {Object.keys(Entities).map(entity => <option key={entity} value={entity}>{entity}</option>)}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Texture</td>
                    <td>
                        <select
                            id="props_texture"
                            defaultValue={props.selection.texture}
                            onChange={props.update}
                        >
                            {Object.keys(Spritesheet.frames).map(frame => <option key={frame} value={frame}>{frame}</option>)}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Position</td>
                    <td>
                        <label>X : </label>
                        <input
                            id="props_position_x"
                            type="number"
                            defaultValue={props.selection.position.x}
                            onChange={props.update}
                        />
                        <br/>
                        
                        <label>Y : </label>
                        <input
                            id="props_position_y"
                            type="number"
                            defaultValue={props.selection.position.x}
                            onChange={props.update}
                        />
                    </td>
                </tr>
            </tbody></table>
        </section>
    );
}

function AdditionalProps (props) {
    if (!props.selection || !Entities[props.selection.type].Properties ) return null;
    
    return (
        <section id="additionalProps">
            <table><tbody>
                {Object.keys(Entities[props.selection.type].Properties).map(prop => {
                    let entity = Entities[props.selection.type].Properties[prop];
                    entity.subFields
                        ? renderInputWithSubfields(entity, prop, props.update)
                        : renderInput(entity, prop, props.update);
                })}
            </tbody></table>
        </section>
    );
}

function renderInput (entity, name, onChange) {
    return (
        <tr key={`prop_${name}`}>
            <td>{entity.name}:</td>
            <td>
                <InputElement
                    type={entity.type}
                    name={name}
                    defaultValue={entity.defaultValue}
                    onChange={onChange}
                />
            </td>
        </tr>
    );
}

function renderInputWithSubfields (entity, name, onChange) {
    return (
        <tr key={`prop_${name}`}>
            <td>{entity.name}</td>
            <td>
                <table><tbody>
                    {entity.subFields.map(sub => (
                        <tr key={`${name}_${sub.name}`}>
                            <td>{sub.name}:</td>
                            <td>
                                <InputElement
                                    name={`${name}_${sub.name}`} 
                                    type={sub.type}
                                    defaultValue={sub.defaultValue} 
                                    onChange={onChange}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody></table>
            </td>
        </tr>
    );
}

function LevelEditorProps (props) {
    return (
        <section id="EditorProps">
            <MainProps {...props} />
            <AdditionalProps {...props} />
        </section>
    );
}

export default LevelEditorProps;