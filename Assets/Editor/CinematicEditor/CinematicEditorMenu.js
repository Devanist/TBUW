import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Assets from '../../assets.json';

import LoadFileButton from '../common/LoadFileButton'
import SaveLink from '../common/SaveLink';
import OptionsList from '../common/OptionsList';

const emptyAnimation = {
    id: "",
    moveTo: {
        x: 0,
        y: 0,
        time: 0,
        wait: 0
    }
};

class CinematicEditorMenu extends Component {
    constructor () {
        super();
        this.state = {
            creation: false,
            warning: "",
            selectedAnimation: null
        };
    }

    cancelCreation () {
        this.setState({creation: false, warning: ""})
    }

    render () {
        return (
            <section id="CinematicEditorMenu">
                <header>
                    <LoadFileButton onChange={this.props.loadConfig} />
                    <SaveLink url={this.props.url} />
                    <OptionsList
                        id="music"
                        size="1"
                        list={Assets.sounds}
                        onChange={this.changeMusic}
                    />
                    <select id="level_music" size="1">
                    </select>
                    <button id="playMusic" value="Play music"/>
                    <input id="timeScreen" type="text" value="0:00" style="width: 35px;"/>
                    <label>Offset:</label>
                    <input type="text" style="width: 35px;" id="musicOffset" value="0:00" />
                    <br/>
                    <button
                        value="Add new animation"
                        onClick={() => {
                            this.setState({
                                selectedAnimation: emptyAnimation
                            });
                        }}
                    />
                </header>
            </section>
        );
    }

    changeMusic () {

    }
}

CinematicEditorMenu.propTypes = {
    loadConfig: PropTypes.func,
    url: PropTypes.string
};
