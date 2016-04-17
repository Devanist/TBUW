define([
    'Screens/Game',
    'Screens/LevelEditor'
], function(Game, LevelEditor){
    
    var Screens = {
        game: Game,
        editor: LevelEditor
    };
    
    return Screens;
    
});