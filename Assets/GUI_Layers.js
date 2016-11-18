define([
    'json!Assets/GUI/Game.json',
    'json!Assets/GUI/Menu.json',
    'json!Assets/GUI/Cinematic.json',
    'json!Assets/GUI/ChapterChoose.json',
    'json!Assets/GUI/LevelChoose.json'
],
function(Game, Menu, Cinematic, ChapterChoose, LevelChoose){
    
    var GUI_Layers = {
        game: Game,
        menu: Menu,
        cinematic: Cinematic,
        chapter_choose: ChapterChoose,
        level_choose: LevelChoose
    };

    return GUI_Layers;

});