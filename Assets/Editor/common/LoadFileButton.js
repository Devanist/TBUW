import PropTypes from 'prop-types';
import React from 'react';

export default function LoadFileButton (props) {
    return (
        <input id="loadFile" type="file" onChange={props.onChange} />
    );
}

LoadFileButton.propTypes = {
    onChange: PropTypes.func.isRequired
};
