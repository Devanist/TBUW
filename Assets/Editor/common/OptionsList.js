import PropTypes from 'prop-types';
import React from 'react';

export default function OptionsList (props) {
    const { list, children, ...rest } = props;

    const options = Object
        .keys(list)
        .map( (item) => (
            <option
                key={item}
                value={item}
            >
                {item}
            </option>
        ));

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
