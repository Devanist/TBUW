define([
    'json!Assets/GUI/Game.json',
    'json!Assets/GUI/Menu.json',
    'json!Assets/GUI/Cinematic.json',
    'json!Assets/GUI/ChapterChoose.json',
    'json!Assets/GUI/LevelChoose.json',
    'json!Assets/GUI/Editor.json',
    'json!Assets/GUI/GUIEditor.json',
    'json!Assets/GUI/CinematicEditor.json'
],
function(Game, Menu, Cinematic, ChapterChoose, LevelChoose, Editor, GUIEditor, CinematicEditor){
    
    var GUI_Layers = {
        game: Game,
        menu: Menu,
        cinematic: Cinematic,
        chapter_choose: ChapterChoose,
        level_choose: LevelChoose,
        editor: Editor,
        guieditor: GUIEditor,
        cinematiceditor: CinematicEditor
    };

    return GUI_Layers;

});