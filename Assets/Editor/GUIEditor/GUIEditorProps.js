import React, {Component} from 'react';
import GUI from '../../../GUI/GUI';
import Spritesheet from '../../Gfx/sprites.json';

class GUIEditorProps extends Component{

    render(){

        return <section id="EditorProps">
            {this.props.selection &&
                <section>
                    <input type="button" value="Clear selection" onClick={this.props.clear} />
                    <table><tbody>
                        <tr>
                            <td>Unique identifier:</td>
                            <td><input id="props_id" type="text" name="props_id" defaultValue={this.props.selection.id} onChange={this.props.update}/></td>
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
                            <td><select id="props_type" defaultValue={this.props.selection.type} onChange={this.props.update}>
                                {Object.keys(GUI).map(gui => <option key={gui} value={gui}>{gui}</option>)}
                            </select></td>
                        </tr>
                        <tr>
                            <td>Texture</td>
                            <td><select id="props_texture" defaultValue={this.props.selection.texture} onChange={this.props.update}>
                                {Object.keys(Spritesheet.frames).map(frame => <option key={frame} value={frame}>{frame}</option>)}
                            </select></td>
                        </tr>
                        <tr>
                            <td>Position</td>
                            <td>
                                <label>X : </label><input id="props_position_x" type="number" defaultValue={this.props.selection.position.x} onChange={this.props.update}/><br/>
                                <label>Y : </label><input id="props_position_y" type="number" defaultValue={this.props.selection.position.x} onChange={this.props.update}/>
                            </td>
                        </tr>
                    </tbody></table>
                </section>
                <section id="additionalProps">
                    <table><tbody>
                        {Object.keys(GUI[this.props.selection.type].Properties).map(prop => {
                            let entity = GUI[this.props.selection.type].Properties[prop];
                            if(entity.subFields){
                                return <tr>
                                    <td>{entity.name}</td>
                                    <td>
                                        <table><tbody>
                                            {entity.subFields.map(sub => {
                                                let content;
                                                switch(sub.type){
                                                    case "Number":
                                                        content = <input 
                                                            name={`${prop}_${sub.name}`}
                                                            type="number"
                                                            defaultValue={sub.defaultValue}
                                                            onChange={this.props.update}
                                                        />;
                                                        break;
                                                    case "Text":
                                                        content = <input 
                                                            name={`${prop}_${sub.name}`}
                                                            type="text"
                                                            defaultValue={sub.defaultValue}
                                                            onChange={this.props.update}
                                                        />;
                                                        break;
                                                    case "Boolean":
                                                        content = <input
                                                            name={`${prop}_${sub.name}`}
                                                            type="checkbox"
                                                            defaultValue={sub.defaultValue}
                                                            onChange={this.props.update}
                                                        />;
                                                        break;
                                                }
                                                return <tr>
                                                    <td>{sub.name}</td>
                                                    <td>
                                                        {content}
                                                    </td>
                                                </tr>
                                            })}
                                        </tbody></table>
                                    </td>
                                </tr>
                            }
                            else{
                                switch(entity.type){

                                }
                            }
                        })}
                    </tbody></table>
                </section>
            }
        </section>

    }

}

export default GUIEditorProps;