import PropTypes from 'prop-types';
import React from 'react';
import Entities from '../../../Entities/Entities';
import Spritesheet from '../../Gfx/sprites.json';
import InputElement from '../common/InputElement';
import OptionsList from '../common/OptionsList';

function MainProps (props) {
    if (!props.selection) return null;

    const { id, type, texture, position } = props.selection;

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
                            defaultValue={id}
                            onChange={props.update}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Type</td>
                    <td>
                        <OptionsList
                            id="props_type"
                            defaultValue={type}
                            onChange={props.update}
                            list={Entities}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Texture</td>
                    <td>
                        <OptionsList
                            id="props_texture"
                            defaultValue={texture}
                            onChange={props.update}
                            list={Spritesheet.frames}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Position</td>
                    <td>
                        <label>X : </label>
                        <input
                            id="props_position_x"
                            type="number"
                            defaultValue={position.x}
                            onChange={props.update}
                        />
                        <br/>
                        <label>Y : </label>
                        <input
                            id="props_position_y"
                            type="number"
                            defaultValue={position.x}
                            onChange={props.update}
                        />
                    </td>
                </tr>
            </tbody></table>
        </section>
    );
}

MainProps.propTypes = {
    selection: PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
        texture: PropTypes.string,
        position: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        })
    }),
    clear: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
};

function AdditionalProps (props) {
    const selectedEntityProps = Entities[props.selection.type].Properties;
    if (!props.selection || !selectedEntityProps ) return null;

    return (
        <section id="additionalProps">
            <table><tbody>
                {Object.keys(selectedEntityProps).map((prop) => {
                    const entity = selectedEntityProps[prop];
                    if (entity.subFields) renderInputWithSubfields(entity, prop, props.update)
                    else renderInput(entity, prop, props.update);
                })}
            </tbody></table>
        </section>
    );
}

AdditionalProps.propTypes = {
    selection: PropTypes.shape({
        type: PropTypes.string
    }),
    update: PropTypes.func.isRequired
};

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
                    {entity.subFields.map((sub) => (
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
