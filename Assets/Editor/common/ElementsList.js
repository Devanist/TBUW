import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ElementsList extends Component {

    constructor () {
        super();
        this.getElement = this.getElement.bind(this);
    }

    getElement (key) {
        return this.props.children.find(child => child.key === key);
    }

    render () {
        const firstButton = this.getComponent(`${props.id}_firstButton`);
        const secondButton =  this.getComponent(`${props.id}_secondButton`);
        const thirdButton = this.getComponent(`${props.id}_thirdButton`);

        return (
            <table className={props.expanded !== props.id && "hidden"}>
                <thead>
                    <tr>
                        <td colSpan="3">Actions</td>
                        <td>ID</td>
                        <td>Type</td>
                        <td>Texture</td>
                        <td>Position</td>
                    </tr>
                </thead>
                <tbody>
                    {props.collection.length === 0
                        && <tr>
                            <td>Scene is empty</td>
                        </tr> 
                        || props.collection.map((item, index) => (
                            <tr key={`${props.itemKey}_${index}`} >
                                <td>
                                    {React.cloneElement(firstButton, {
                                        onClick: () => {firstButton.props.onClick(item.id)}
                                    })}
                                </td>
                                <td>
                                    {React.cloneElement(secondButton, {
                                        onClick: () => {secondButton.props.onClick(item.id)}
                                    })}
                                </td>
                                <td>
                                    {React.cloneElement(thirdButton, {
                                        onClick: () => {thirdButton.props.onClick(item.id)}
                                    })}
                                </td>
                                <td className="entityIDcell"
                                    onClick={() => {props.select(item.id)}}
                                >
                                    {item.id}
                                </td>
                                <td>{item.type}</td>
                                <td>{item.texture}</td>
                                <td>{
                                    typeof elem.position === "string" &&
                                    elem.position ||
                                    `${elem.position.x}:${elem.position.y}`
                                }
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        );
    }
}

ElementsList.propTypes = {
    expanded: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    collection: PropTypes.arrayOf(PropTypes.shape()),
    itemKey: PropTypes.string.isRequired,
};
