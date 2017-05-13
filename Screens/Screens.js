import GameScreen from './Game';
import LevelEditorScreen from './LevelEditor.js';
import MenuScreen from './Menu';
import CinematicScreen from './Cinematic';
import ChapterChooseScreen from './ChapterChoose';
import LevelChooseScreen from './LevelChoose';
import GUIEditorScreen from './GUIEditor';
import CinematicEditorScreen from './CinematicEditor';
import ReactLevelEditor from './ReactLevelEditor';
    
const Screens = {
    game:               GameScreen,
    editor:             LevelEditorScreen,
    guieditor:          GUIEditorScreen,
    cinematiceditor:    CinematicEditorScreen,
    menu:               MenuScreen,
    cinematic:          CinematicScreen,
    chapter_choose:     ChapterChooseScreen,
    level_choose:       LevelChooseScreen,
    reacteditor:        ReactLevelEditor
};

export default Screens;