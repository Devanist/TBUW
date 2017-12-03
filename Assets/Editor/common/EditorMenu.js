import React from 'react';
import PropTypes from 'prop-types';

import CreationPopup from './CreationPopup';

export default function EditorMenu (props) {
    return (
        <section id="EditorMenu">
            <CreationPopup {...props} />
            {props.children}
        </section>
    );
}

EditorMenu.propTypes = {
    children: PropTypes.arrayOf(PropTypes.shape())
};
