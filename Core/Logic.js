define([
    'Core/Stage',
    'Core/Levels',
    'Core/Screens'
    ], function(Stage, Levels, Screens){
    
    var Logic = function(loader, rootStage){
        this._loader = loader;
        this._rootStage = rootStage;
        this._screens = Screens;
        this._currentScreen = null;
        this._keyboardHandler = null;
    };
    
    Logic.prototype = {
        
        run : function(animate){
            document.addEventListener("keydown", this._keyboardHandler, false);
            this.initScreen("game");
            animate();
        },
        
        update : function(){
            this._currentScreen.update();
        },
        
        getScale : function(){
            return this._scale;
        },
        
        setKeyboardHandler: function (foo) {
            var that = this;
            document.removeEventListener("keydown", this._keyboardHandler, false);
            this._keyboardHandler = foo;
            document.addEventListener("keydown", this._keyboardHandler.bind(that._currentScreen), false);
        },
        
        setCurrentScreen : function(screen){
            this._currentScreen = screen;
        },
        
        initScreen : function(screen){
            this._currentScreen = new this._screens[screen]();            
            this._loader.loadStageConfig(this._currentScreen.getStage(), Levels.one.entities);
            this._currentScreen.init();
            this.setKeyboardHandler(this._currentScreen.keyboardHandler);
            this._rootStage.add(this._currentScreen.getStage());
        }
    };
    
    return Logic;
    
});