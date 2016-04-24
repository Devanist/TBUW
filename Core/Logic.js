define([
    'Core/Stage',
    'Core/Levels',
    'Screens/Screens'
    ], function(Stage, Levels, Screens){
    
    /**
     * Class handling all not-game involved logic like changing screens, updating gfx
     * @param {Loader} loader Loader object
     * @param {Stage} rootStage The root stage of all other stages
     * @param {Keyboard} keyboard Keyboard object
     * @param {Mouse} mouse Mouse object
     * @param {TouchDevice} touchDevice TouchDevice object
     */
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
        
        /**
         * Init the start screen then run animation and logic updating functions.
         * @param {function} animate Function animating screen
         */
        run : function(animate){
            this.initScreen("game");
            animate();
            this.update();
        },
        
        /**
         * Method updates the application logic 60 times per second.
         */
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
            setTimeout(function(){
                this.update();
            }.bind(this), 16);
        },
        
        /**
         * Method sets the current screen that should be showed.
         * @param {string} name Name of the screen to show
         */
        setCurrentScreen : function(name){
            this._currentScreen.name = name;
            this._currentScreen.screen = new this._screens[name]();
        },
        
        /**
         * Method initializates the given screen.
         * @param {string} screen Name of a screen to initialize
         */
        initScreen : function(screen){
            this.setCurrentScreen(screen);
            if(screen === "game"){
                this._loader.loadStageConfig(this._currentScreen.screen.getBackgroundStage(), Levels.one.background);
                this._loader.loadStageConfig(this._currentScreen.screen.getMainStage(), Levels.one.entities, true);
            }
            this._rootStage.add(this._currentScreen.screen.getStage());
        }
    };
    
    return Logic;
    
});