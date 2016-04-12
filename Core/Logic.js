define([
    'Core/Stage',
    'Core/Levels',
    'Core/Screens'
    ], function(Stage, Levels, Screens){
    
    var Logic = function(loader, rootStage, keyboard, mouse, touchDevice){

        this._loader = loader;
        this._rootStage = rootStage;
        this._screens = Screens;
        this._currentScreen = {name: "", screen: null};
        this._keyboard = keyboard;
        this._touchDevice = touchDevice || null;
        this._mouse = mouse;
    };
    
    Logic.prototype = {
        
        run : function(animate){
            this.initScreen("game");
            animate();
        },
        
        update : function(){
            var updateResult = this._currentScreen.screen.update(
                this._keyboard.getKeysState(), 
                this._mouse.getClicks(),
                this._touchDevice.getTouches()
            );
            if(updateResult.action === "RESTART"){
                console.log('restarting screen');
                this.initScreen(this._currentScreen.name);
            }
        },
        
        setCurrentScreen : function(name){
            this._currentScreen.name = name;
            this._currentScreen.screen = new this._screens[name]();
        },
        
        initScreen : function(screen){
            this.setCurrentScreen(screen);
            this._loader.loadStageConfig(this._currentScreen.screen.getBackgroundStage(), Levels.one.background);
            this._loader.loadStageConfig(this._currentScreen.screen.getGameStage(), Levels.one.entities);
            this._currentScreen.screen.loadGUI();
            this._rootStage.add(this._currentScreen.screen.getStage());
        }
    };
    
    return Logic;
    
});