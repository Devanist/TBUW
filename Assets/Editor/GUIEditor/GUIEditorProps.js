import PropTypes from 'prop-types';
import React from 'react';
import GUI from '../../../GUI/GUI';
import Spritesheet from '../../Gfx/sprites.json';
import InputElement from '../common/InputElement';
import OptionsList from '../common/OptionsList';

const DEFAULT_POSITION = 0;

function getDefaultValue (item, prop) {
    return item.type === "Boolean"
        ? (prop === undefined || prop === null) && item.defaultValue || prop
        : prop || item.defaultValue;
}

function RenderInput (props) {
    const { entity, name, onChange, prop } = props;
    const defaultValue = getDefaultValue(entity, prop);

    return (
        <tr key={`prop_${entity.name}`}>
            <td>{entity.name}</td>
            <td>
                <InputElement
                    type={entity.type}
                    defaultValue={defaultValue}
                    name={name}
                    onChange={onChange}
                />
            </td>
        </tr>
    );
}

RenderInput.propTypes = {
    prop: PropTypes.oneOf([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool
    ]),
    onChange: PropTypes.func,
    name: PropTypes.string,
    entity: PropTypes.shape({
        type: PropTypes.string,
        name: PropTypes.string
    })
};

function RenderInputWithSubfields (props) {
    const { entity, name, onChange, prop} = props;

    return (
        <tr key={`prop_${entity.name}`}>
            <td>{entity.name}</td>
            <td>
                <table><tbody>
                    {entity.subFields.map((sub) => {
                        const defaultValue = getDefaultValue(sub, prop[sub.name]);

                        return (
                            <tr key={`${entity.name}_${sub.name}`}>
                                <td>{sub.name}</td>
                                <td>
                                    <InputElement
                                        type={sub.type}
                                        name={`${name}_${sub.name}`}
                                        defaultValue={defaultValue}
                                        onChange={onChange}
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

RenderInputWithSubfields.propTypes = {
    entity: PropTypes.shape({

    }),
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    prop: PropTypes.shape()
};

export default function GUIEditorProps (props) {
    const selection = props.selection;
    if (!selection) return <section id="EditorProps" />

    return (
        <section id="EditorProps">
            <section>
                <button value="Clear selection" onClick={props.clear} />
                <table><tbody>
                    <tr>
                        <td>Unique identifier:</td>
                        <td>
                            <input id="props_id" type="text" name="props_id" defaultValue={selection.id} onChange={props.update}/>
                        </td>
                    </tr>
                    <tr>
                        <td>Layer</td>
                        <td>
                            <select id="props_layer" defaultValue={props.selectedLayer} onChange={props.update}>
                                <option value="GUI">GUI</option>
                                <option value="Background">Background</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td>
                            <OptionsList
                                id="props_type"
                                defaultValue={selection.type}
                                onChange={props.update}
                                list={GUI}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Texture</td>
                        <td>
                            <OptionsList
                                id="props_texture"
                                defaultValue={selection.texture}
                                onChange={props.update}
                                list={Spritesheet.frames}
                            >
                                <option value="">none</option>
                            </OptionsList>
                        </td>
                    </tr>
                    <tr>
                        <td>String position: </td>
                        <td>
                            <input
                                id="positionChange"
                                type="checkbox"
                                defaultChecked={typeof selection.position === "string"}
                                onClick={props.positionChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Position</td>
                        <td>
                            {typeof selection.position === "string"
                                ? <select id="positionString" name="position-string" onChange={props.update}>
                                    <option value="center">center</option>
                                    <option value="left-top">left-top</option>
                                </select>
                                : <p>
                                    <label>X : </label>
                                    <input id="props_position_x" type="number" defaultValue={selection.position.x} onChange={props.update}/>
                                    <br/>

                                    <label>Y : </label>
                                    <input id="props_position_y" type="number" defaultValue={selection.position.y} onChange={props.update}/>
                                </p>
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>Move</td>
                        <td>
                            <label>X : </label>
                            <input id="props_move_x" type="number" defaultValue={selection.move && selection.move.x || DEFAULT_POSITION } onChange={props.update}/>
                            <br/>

                            <label>Y : </label>
                            <input id="props_move_y" type="number" defaultValue={selection.move && selection.move.y || DEFAULT_POSITION } onChange={props.update}/>
                        </td>
                    </tr>
                    <tr>
                        <td>Visible</td>
                        <td>
                            <input
                                id="props_visible"
                                type="checkbox"
                                defaultChecked={(props.selection.visible === undefined && true) || props.selection.visible }
                                name="visible"
                                onClick={props.update}
                            />
                        </td>
                    </tr>
                </tbody></table>
            </section>
            <section id="additionalProps">
                <table><tbody>
                    {Object.keys(GUI[selection.type].Properties).map((prop) => {
                        const entity = GUI[selection.type].Properties[prop];
                        return entity.subFields
                            ? <RenderInputWithSubfields entity={entity} name={prop} prop={props.selection[prop]} onChange={props.update} />
                            : <RenderInput entity={entity} prop={props.selection[prop]} onChange={props.update} />;
                    })}
                </tbody></table>
            </section>
        </section>
    );
}

GUIEditorProps.propTypes = {
    selection: PropTypes.shape({
        visible: PropTypes.bool
    }),
    positionChange: PropTypes.func.isRequired,
    selectedLayer: PropTypes.string,
    update: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired
};
