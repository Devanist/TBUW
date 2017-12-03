import React from 'react';
import PropTypes from 'prop-types';

export default function EditorMenu (props) {
    return (
        <section id="EditorMenu">
            <CreationPopup {...props} />
            {props.children}
        </section>
    );
}

EditorMenu.propTypes = {
    GUI: PropTypes.bool,
    Cinematic: PropTypes.bool,
    creationStarted: PropTypes.bool,
    warning: PropTypes.string,
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    children: PropTypes.arrayOf(PropTypes.shape())
};
