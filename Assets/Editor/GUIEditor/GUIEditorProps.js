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
                                <option value="">none</option>
                                {Object.keys(Spritesheet.frames).map(frame => <option key={frame} value={frame}>{frame}</option>)}
                            </select></td>
                        </tr>
                        <tr>
                            <td>String position: </td>
                            <td><input 
                                    id="positionChange"
                                    type="checkbox" 
                                    defaultValue={typeof this.props.selection.position === "string"} 
                                    onClick={this.props.positionChange}    
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Position</td>
                            <td>
                                {
                                    typeof this.props.selection.position === "string" &&
                                    <select id="positionString" name="position-string">
                                        <option value="center">center</option>
                                        <option value="left-top">left-top</option>
                                    </select> ||
                                    <p>
                                        <label>X : </label><input id="props_position_x" type="number" defaultValue={this.props.selection.position.x} onChange={this.props.update}/><br/>
                                        <label>Y : </label><input id="props_position_y" type="number" defaultValue={this.props.selection.position.y} onChange={this.props.update}/>
                                    </p>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>Move</td>
                            <td>
                                <label>X : </label><input id="props_move_x" type="number" defaultValue={this.props.selection.move && this.props.selection.move.x || 0} onChange={this.props.update}/><br/>
                                <label>Y : </label><input id="props_move_y" type="number" defaultValue={this.props.selection.move && this.props.selection.move.y || 0} onChange={this.props.update}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Visible</td>
                            <td>
                                <input  id="props_visible" 
                                        type="checkbox" 
                                        defaultChecked={(this.props.selection.visible === undefined || this.props.selection.visible === null) && true || this.props.selection.visible}
                                        name="visible"
                                        onClick={this.props.update}
                                />
                            </td>
                        </tr>
                    </tbody></table>
                </section>
            }
            {this.props.selection &&
                <section id="additionalProps">
                    <table><tbody>
                        {Object.keys(GUI[this.props.selection.type].Properties).map(prop => {
                            let entity = GUI[this.props.selection.type].Properties[prop];
                            if(entity.subFields){
                                return <tr key={`prop_${entity.name}`}>
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
                                                            defaultValue={this.props.selection[sub.name] || sub.defaultValue}
                                                            onChange={this.props.update}
                                                        />;
                                                        break;
                                                    case "Text":
                                                        content = <input 
                                                            name={`${prop}_${sub.name}`}
                                                            type="text"
                                                            defaultValue={this.props.selection[sub.name] || sub.defaultValue}
                                                            onChange={this.props.update}
                                                        />;
                                                        break;
                                                    case "Boolean":
                                                        content = <input
                                                            name={`${prop}_${sub.name}`}
                                                            type="checkbox"
                                                            defaultChecked={this.props.selection[sub.name] || sub.defaultValue}
                                                            onChange={this.props.update}
                                                        />;
                                                        break;
                                                }
                                                return <tr key={`${entity.name}_${sub.name}`}>
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
                                let input;
                                switch(entity.type){
                                    case "Number" :
                                        input = <input type="number" name={prop} defaultValue={this.props.selection[prop] || entity.defaultValue} onChange={this.props.update}/>
                                        break;
                                    case "Text" : 
                                        input = <input type="text" name={prop} defaultValue={this.props.selection[prop] || entity.defaultValue} onChange={this.props.update}/>
                                        break;
                                    case "Boolean":
                                        input = <input type="checkbox" name={prop} defaultChecked={this.props.selection[prop] || entity.defaultValue} />
                                        break;
                                    default: 
                                        console.error(`No type like : ${entity.type}`);
                                        break;
                                }
                                return <tr key={`prop_${entity.name}`}>
                                    <td>{entity.name}</td>
                                    <td>{input}</td>
                                </tr>;
                            }
                        })}
                    </tbody></table>
                </section>
            }
        </section>

    }

}

export default GUIEditorProps;