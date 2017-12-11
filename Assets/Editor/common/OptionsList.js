import PropTypes from 'prop-types';
import React from 'react';

export default function OptionsList (props) {
    const { list, children, ...rest } = props;

    const options = Object
        .keys(list)
        .map( (item) => {
            const valueToDisplay = item.name ? item.name : item;

            return (
                <option
                    key={valueToDisplay}
                    value={valueToDisplay}
                >
                    {valueToDisplay}
                </option>
            )
        });

    return (
        <OptionsList {...rest}>
            {children}
            {options}
        </OptionsList>
    );
}

OptionsList.propTypes = {
    list: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.oneOf([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])
};
