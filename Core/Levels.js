define([
    'Assets/Levels/Levels',
    'Assets/Cinematics/Cinematics'
], function(LevelsCfg, Cinematics){
    
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
            data: LevelsCfg.C1_L1
        }
    ];
    
    return Levels;
    
});