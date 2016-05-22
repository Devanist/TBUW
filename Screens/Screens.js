define([
    'Screens/Game',
    'Screens/LevelEditor',
    'Screens/Menu',
    'Screens/Cinematic'
], function(Game, LevelEditor, Menu, Cinematic){
    
    var Screens = {
        game: Game,
        editor: LevelEditor,
        menu: Menu,
        cinematic: Cinematic
    };
    
    return Screens;
    
});