import React, {Component} from 'react';
import Entities from '../../../Entities/Entities';
import Spritesheet from '../../Gfx/sprites.json';

class LevelEditorProps extends Component{

            constructor(){
                super();
            }

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
                                    <td>Type</td>
                                    <td><select id="props_type" defaultValue={this.props.selection.type} onChange={this.props.update}>
                                        {Object.keys(Entities).map(entity => <option key={entity} value={entity}>{entity}</option>)}
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
                    }
                    {this.props.selection && Entities[this.props.selection.type].Properties &&
                        <section id="additionalProps">
                            <table><tbody>
                                {Object.keys(Entities[this.props.selection.type].Properties).map(prop => {
                                    let entity = Entities[this.props.selection.type].Properties[prop];
                                    if(entity.subFields){
                                        return <tr key={`prop_${prop}`}>
                                            <td>{entity.name}</td>
                                            <td>
                                                <table><tbody>
                                                    {entity.subFields.map(sub => {
                                                        console.log(sub);
                                                        switch(sub.type){
                                                            case "Number": 
                                                                console.log('dupa');
                                                                return <tr key={`${prop}_${sub.name}`}>
                                                                    <td>{sub.name}:</td>
                                                                    <td><input  name={`${prop}_${sub.name}`} 
                                                                                type="number" 
                                                                                defaultValue={sub.defaultValue} 
                                                                                onChange={this.props.update}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                        }
                                                    })}
                                                </tbody></table>
                                            </td>
                                        </tr>
                                    }
                                    else{
                                        switch(entity.type){
                                            case "Number": return <tr key={`prop_${prop}`}>
                                                <td>{entity.name}:</td>
                                                <td><input  name={prop} 
                                                            type="number" 
                                                            defaultValue={entity.defaultValue} 
                                                            onChange={this.props.update}
                                                    />
                                                </td>
                                            </tr>
                                        }
                                    }
                                })}
                            </tbody></table>
                        </section>
                    }
                </section>
            }
        }

export default LevelEditorProps;