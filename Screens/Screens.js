define([
    'Screens/Game',
    'Screens/LevelEditor',
    'Screens/Menu'
], function(Game, LevelEditor, Menu){
    
    var Screens = {
        game: Game,
        editor: LevelEditor,
        menu: Menu
    };
    
    return Screens;
    
});