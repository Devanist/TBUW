define([
    'Core/Stage',
    'Core/Levels',
    'Core/Screens'
    ], function(Stage, Levels, Screens){
    
    var Logic = function(loader, rootStage, keyboard, touch){
        this._loader = loader;
        this._rootStage = rootStage;
        this._screens = Screens;
        this._currentScreen = null;
        this._keyboard = keyboard;
        this._touch = touch;
    };
    
    Logic.prototype = {
        
        run : function(animate){
            this.initScreen("game");
            animate();
        },
        
        update : function(){
            this._currentScreen.update(this._keyboard.getKeysState());
        },
        
        getScale : function(){
            return this._scale;
        },
        
        setCurrentScreen : function(screen){
            this._currentScreen = screen;
        },
        
        initScreen : function(screen){
            this._currentScreen = new this._screens[screen]();            
            this._loader.loadStageConfig(this._currentScreen.getStage(), Levels.one.entities);
            this._currentScreen.init();
            this._rootStage.add(this._currentScreen.getStage());
        }
    };
    
    return Logic;
    
});