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
            }
        };
    }

    loadConfig (event) {
        const file = event.target.files[FILE_INDEX];
        if (!file) return;

        const editorContext = this;
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            editorContext.setState({
                level: JSON.parse(content)
            });
            editorContext.p
        }
        reader.readAsText(file);
    }

    render () {
        return (
            <section id="CinematicEditor">
                <CinematicEditorMenu
                />
            </section>
        );
    }
}
