import PropTypes from 'prop-types';
import React from 'react';

export default function SaveLink (props) {
    const message = `Right click here and select 'Save as'`;

    return (
        <p>
            <a href={props.url}>
                {message}
            </a>
        </p>
    );
}

SaveLink.propTypes = {
    url: PropTypes.string
};
