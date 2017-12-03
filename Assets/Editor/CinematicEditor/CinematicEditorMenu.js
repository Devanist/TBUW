import React, {Component} from 'react';

import CreationPopup from '../common/CreationPopup';
import LoadFileButton from '../common/LoadFileButton'
import SaveLink from '../common/SaveLink';

class CinematicEditorMenu extends Component {
    constructor () {
        super();
        this.state = {
            creation: false,
            warning: ""
        };
    }

    cancelCreation () {
        this.setState({creation: false, warning: ""})
    }

    render () {
        return (
            <section id="CinematicEditorMenu">
                <CreationPopup
                    creationStarted={this.state.creation}
                    warning={this.state.warning}
                    onAdd={this.addNewAnimationToScene}
                    onCancel={this.cancelCreation}
                />
                <header>
                    <LoadFileButton onChange={this.props.loadConfig} />
                    <SaveLink url={this.props.url} />
                </header>
            </section>
        );
    }
}
