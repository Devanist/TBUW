import PropTypes from 'prop-types';
import React, {Component} from 'react';
import CinematicEditorMenu from './CinematicEditorMenu';

const FILE_INDEX = 0;
export default class CinematicEditorMain extends Component {
    constructor () {
        super();
        this.state = {
            cinematic: {
                frames: [],
                music: "",
                music_offset: 0,
                animations: []
            },
            selectedAnimation: null
        };
    }

    loadConfig (event) {
        const file = event.target.files[FILE_INDEX];
        if (!file) return;

        const editorMainContext = this;
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            editorMainContext.setState({
                cinematic: JSON.parse(content)
            });

            this.props.updateStage(this.state.cinematic);
            this.props.countTotalTime();
        }
        reader.readAsText(file);
    }

    render () {
        return (
            <section id="CinematicEditor">
                <CinematicEditorMenu
                    loadConfig={this.loadConfig}
                    add={this.addToScene}
                />
            </section>
        );
    }

    addToScript () {

    }
}

CinematicEditorMain.propTypes = {
    countTotalTime: PropTypes.func.isRequired,
    updateStage: PropTypes.func.isRequired
};
