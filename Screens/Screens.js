define([
    'Screens/Game',
    'Screens/LevelEditor',
    'Screens/Menu',
    'Screens/Cinematic',
    'Screens/ChapterChoose'
], function(Game, LevelEditor, Menu, Cinematic, ChapterChoose){
    
    var Screens = {
        game: Game,
        editor: LevelEditor,
        menu: Menu,
        cinematic: Cinematic,
        chapter_choose: ChapterChoose
    };
    
    return Screens;
    
});