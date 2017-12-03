import PropTypes from 'prop-types';
import React from 'react';

import OptionsList from './OptionsList';
import Entities from '../../../Entities/Entities';
import Spritesheet from '../../Gfx/sprites.json';
import GUI from '../../../GUI/GUI';

export default function CreationPopup (props) {
    if (!props.creationStarted) return null;

    return (
        <section id="creationWindow">
            <p style={{ color: "red"}}>{props.warning}</p>
            <table><tbody>
                <tr>
                    <td>Identifier</td>
                    <td><input id="idSelection" type="text" /></td>
                </tr>
                {props.GUI &&
                    <tr>
                        <td>Layer</td>
                        <td>
                            <select id="layerSelection">
                                <option value="GUI">GUI</option>
                                <option value="Background">Background</option>
                            </select>
                        </td>
                    </tr>
                }
                <tr>
                    <td>Type</td>
                    <td>
                        <OptionsList
                            id="typeSelection"
                            list={props.GUI ? GUI : Entities}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Texture</td>
                    <td>
                        <OptionsList
                            id="textureSelection"
                            list={Spritesheet.frames}
                        >
                            <option value="">none</option>
                        </OptionsList>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button
                            value="Add"
                            onClick={props.onAdd}
                        />
                    </td>
                    <td>
                        <button
                            onClick={props.onCancel}
                            value="Cancel"
                        />
                    </td>
                </tr>
            </tbody></table>
        </section>
    );
}

CreationPopup.propTypes = {
    onCancel: PropTypes.func,
    onAdd: PropTypes.func,
    GUI: PropTypes.bool,
    warning: PropTypes.string,
    creationStarted: PropTypes.bool
};
