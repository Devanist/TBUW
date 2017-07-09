import GameScreen from './Game';
import MenuScreen from './Menu';
import CinematicScreen from './Cinematic';
import ChapterChooseScreen from './ChapterChoose';
import LevelChooseScreen from './LevelChoose';
import GUIEditorScreen from './GUIEditor';
import CinematicEditorScreen from './CinematicEditor';
import LevelEditor from './LevelEditor';
import GUIEditor from './GUIEditor';
    
const Screens = {
    game:               GameScreen,
    cinematiceditor:    CinematicEditorScreen,
    menu:               MenuScreen,
    cinematic:          CinematicScreen,
    chapter_choose:     ChapterChooseScreen,
    level_choose:       LevelChooseScreen,
    editor:             LevelEditor,
    guieditor:          GUIEditor
};

export default Screens;