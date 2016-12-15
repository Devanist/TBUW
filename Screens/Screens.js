define([
    'Screens/Game',
    'Screens/LevelEditor',
    'Screens/Menu',
    'Screens/Cinematic',
    'Screens/ChapterChoose',
    'Screens/LevelChoose',
    'Screens/GUIEditor',
    'Screens/CinematicEditor'
], function(Game, LevelEditor, Menu, Cinematic, ChapterChoose, LevelChoose, GUIEditor, CinematicEditor){
    
    var Screens = {
        game: Game,
        editor: LevelEditor,
        guieditor: GUIEditor,
        cinematiceditor: CinematicEditor,
        menu: Menu,
        cinematic: Cinematic,
        chapter_choose: ChapterChoose,
        level_choose: LevelChoose
    };
    
    return Screens;
    
});