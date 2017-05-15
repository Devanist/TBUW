import GameScreen from './Game';
import MenuScreen from './Menu';
import CinematicScreen from './Cinematic';
import ChapterChooseScreen from './ChapterChoose';
import LevelChooseScreen from './LevelChoose';
import GUIEditorScreen from './GUIEditor';
import CinematicEditorScreen from './CinematicEditor';
import LevelEditor from './LevelEditor';
import ReactGUIEditor from './ReactGUIEditor';
    
const Screens = {
    game:               GameScreen,
    guieditor:          GUIEditorScreen,
    cinematiceditor:    CinematicEditorScreen,
    menu:               MenuScreen,
    cinematic:          CinematicScreen,
    chapter_choose:     ChapterChooseScreen,
    level_choose:       LevelChooseScreen,
    editor:             LevelEditor,
    reactguieditor:     ReactGUIEditor
};

export default Screens;