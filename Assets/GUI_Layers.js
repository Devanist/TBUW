import GameLayers from './GUI/Game.json';
import MenuLayers from './GUI/Menu.json';
import CinematicLayers from './GUI/Cinematic.json';
import ChapterChooseLayers from './GUI/ChapterChoose.json';
import LevelChooseLayers from './GUI/LevelChoose.json';
import GUIEditorLayers from './GUI/GUIEditor.json';
import CinematicEditorLayers from './GUI/CinematicEditor.json';
import LevelEditor from './GUI/LevelEditor.json';

const GUI_Layers = {
    game: GameLayers,
    menu: MenuLayers,
    cinematic: CinematicLayers,
    chapter_choose: ChapterChooseLayers,
    level_choose: LevelChooseLayers,
    guieditor: GUIEditorLayers,
    cinematiceditor: CinematicEditorLayers,
    editor: LevelEditor,
    reactguieditor: GUIEditorLayers
};

export default GUI_Layers;
