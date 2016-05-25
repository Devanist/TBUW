define([
    'json!Assets/Levels/level_one.json',
    'Assets/Cinematics/Cinematics'
], function(one, Cinematics){
    
    /**
     * Collection of all levels.
     */
    var Levels = [
        {
            type: "cinematic",
            name: "Intro",
            data: Cinematics.intro
        },
        {
            type: "level",
            name: "one",
            data: one
        }
    ];
    
    return Levels;
    
});