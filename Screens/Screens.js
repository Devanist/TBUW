define([
    'Screens/Game',
    'Screens/LevelEditor',
    'Screens/Menu',
    'Screens/Cinematic',
    'Screens/ChapterChoose',
    'Screens/LevelChoose',
    'Screens/GUIEditor'
], function(Game, LevelEditor, Menu, Cinematic, ChapterChoose, LevelChoose, GUIEditor){
    
    var Screens = {
        game: Game,
        editor: LevelEditor,
        guieditor: GUIEditor,
        menu: Menu,
        cinematic: Cinematic,
        chapter_choose: ChapterChoose,
        level_choose: LevelChoose
    };
    
    return Screens;
    
});