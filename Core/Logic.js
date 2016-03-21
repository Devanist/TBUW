define([
    'Core/Stage',
    'Core/Levels',
    'Core/Level'
    ], function(Stage, Levels, Level){
    
    var Logic = function(loader, rootStage){
        this._loader = loader;
        this._rootStage = rootStage;
        this._levels = {};
    };
    
    Logic.prototype = {
        
        run : function(animate){
            var gameStage = new Stage();
            this._loader.loadStageConfig(gameStage, Levels.one.entities);
            this._rootStage.add(gameStage);
            
            animate();
        },
        
        update : function(){
            
        },
        
        getScale : function(){
            return this._scale;
        }
        
    };
    
    return Logic;
    
});