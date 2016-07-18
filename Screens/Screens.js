define([
    'Screens/Game',
    'Screens/LevelEditor',
    'Screens/Menu',
    'Screens/Cinematic',
    'Screens/ChapterChoose',
    'Screens/LevelChoose'
], function(Game, LevelEditor, Menu, Cinematic, ChapterChoose, LevelChoose){
    
    var Screens = {
        game: Game,
        editor: LevelEditor,
        menu: Menu,
        cinematic: Cinematic,
        chapter_choose: ChapterChoose,
        level_choose: LevelChoose
    };
    
    return Screens;
    
});