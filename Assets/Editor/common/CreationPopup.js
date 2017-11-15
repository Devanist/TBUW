import Entities from '../../../Entities/Entities';
import Spritesheet from '../../Gfx/sprites.json';
import GUI from '../../../GUI/GUI';

export default function CreationPopup (props) {
    if (!props.creationStarted) return null;

    return (
        <section id="creationWindow">
            <p style={{color : "red"}}>{props.warning}</p>
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
                        <select id="typeSelection">
                            {Object.keys(props.GUI ? GUI : Entities).
                                map(entity => (
                                    <option 
                                        key={entity}
                                        value={entity}
                                    >
                                        {entity}
                                    </option>
                                ))
                            }
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Texture</td>
                    <td>
                        <select id="textureSelection">
                            <option value="">none</option>
                            {Object.keys(Spritesheet.frames).
                                map(frame => (
                                    <option
                                        key={frame}
                                        value={frame}
                                    >
                                        {frame}
                                    </option>
                                )
                            )}
                    </select></td>
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