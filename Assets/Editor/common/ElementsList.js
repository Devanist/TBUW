import PropTypes from 'prop-types';
import React from 'react';

function getComponent (list, key) {
    return list.find((child) => child.key === key);
}

export default function ElementsList (props) {
    const { children } = props;
    const firstButton = getComponent(children, `${props.id}_firstButton`);
    const secondButton = getComponent(children, `${props.id}_secondButton`);
    const thirdButton = getComponent(children, `${props.id}_thirdButton`);

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
                {!props.collection.length
                    ? <tr>
                        <td>Scene is empty</td>
                    </tr>
                    : props.collection.map((item, index) => (
                        <tr key={`${props.itemKey}_${index}`} >
                            <td>
                                {React.cloneElement(firstButton, {
                                    onClick: () => { firstButton.props.onClick(item.id) }
                                })}
                            </td>
                            <td>
                                {React.cloneElement(secondButton, {
                                    onClick: () => { secondButton.props.onClick(item.id) }
                                })}
                            </td>
                            <td>
                                {React.cloneElement(thirdButton, {
                                    onClick: () => { thirdButton.props.onClick(item.id) }
                                })}
                            </td>
                            <td className="entityIDcell"
                                onClick={() => { props.select(item.id) }}
                            >
                                {item.id}
                            </td>
                            <td>{item.type}</td>
                            <td>{item.texture}</td>
                            <td>
                                {typeof item.position === "string"
                                    ? item.position
                                    : `${item.position.x}:${item.position.y}`
                                }
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
}

ElementsList.propTypes = {
    expanded: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    collection: PropTypes.arrayOf(PropTypes.shape()),
    itemKey: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])
};
