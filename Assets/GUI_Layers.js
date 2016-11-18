define([
    'json!Assets/GUI/Game.json',
    'json!Assets/GUI/Menu.json',
    'json!Assets/GUI/Cinematic.json',
    'json!Assets/GUI/ChapterChoose.json',
    'json!Assets/GUI/LevelChoose.json',
    'json!Assets/GUI/Editor.json',
    'json!Assets/GUI/GUIEditor.json'
],
function(Game, Menu, Cinematic, ChapterChoose, LevelChoose, Editor, GUIEditor){
    
    var GUI_Layers = {
        game: Game,
        menu: Menu,
        cinematic: Cinematic,
        chapter_choose: ChapterChoose,
        level_choose: LevelChoose,
        editor: Editor,
        guieditor: GUIEditor
    };

    return GUI_Layers;

});