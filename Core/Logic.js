define([
    'Core/Stage',
    'Assets/Levels/Levels',
    'Screens/Screens',
    'Assets/Cinematics/Cinematics',
    'json!game_cfg.json',
    'Assets/GUI_Layers'
    ], function(Stage, Levels, Screens, Cinematics, cfg, GUILayers){
    
    /**
     * Class handling all not-game involved logic like changing screens, updating gfx
     * @param {Loader} loader Loader object
     * @param {Stage} rootStage The root stage of all other stages
     * @param {Keyboard} keyboard Keyboard object
     * @param {Mouse} mouse Mouse object
     * @param {TouchDevice} touchDevice TouchDevice object
     */
    var Logic = function(loader, rootStage, speaker, keyboard, mouse, touchDevice){

        this._loader = loader;
        this._rootStage = rootStage;
        this._screens = Screens;
        this._currentScreen = {name: "", screen: null};
        this._speaker = speaker;
        this._keyboard = keyboard;
        this._touchDevice = touchDevice || null;
        this._mouse = mouse;
    };
    
    Logic.prototype = {
        
        /**
         * Init the start screen then run animation and logic updating functions.
         * @param {function} animate Function animating screen
         */
        run : function(){
            this.initScreen(cfg.initScreen);
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
                this._rootStage.removeAll();
                this.initScreen(this._currentScreen.name, updateResult.params);
            }
            else if(updateResult.action === "CHANGE"){
                if(updateResult.sameMusic !== true){
                    this._speaker.stop("all");
                }
                this._rootStage.removeAll();
                this.initScreen(updateResult.changeTo, updateResult.params);
            }
            else{
                this._speaker.update(updateResult.playSound);
            }
            setTimeout(function(){
                this.update();
            }.bind(this), 16);
        },
        
        /**
         * Method sets the current screen that should be showed.
         * @param {string} name Name of the screen to show
         */
        setCurrentScreen : function(name, params){
            this._keyboard.reset();
            this._mouse.reset();
            this._currentScreen.name = name;
            this._currentScreen.screen = new this._screens[name](params);
        },
        
        /**
         * Method initializates the given screen.
         * @param {string} screen Name of a screen to initialize
         */
        initScreen : function(screen, params){
            params = params || {};
            this.setCurrentScreen(screen, params);
            if(screen === "game"){
                this._currentScreen.screen.setMusic(Levels[params.cfg].music);
                this._currentScreen.screen.setEndX(Levels[params.cfg].level_end_x);
                this._loader.loadStageConfig(this._currentScreen.screen.getBackgroundStage(), Levels[params.cfg].background);
                this._loader.loadStageConfig(this._currentScreen.screen.getMainStage(), Levels[params.cfg].entities, cfg.showBorderLines);
                this._loader.loadGUILayer(this._currentScreen.screen.getGUIStage(), GUILayers[screen]);
                this._currentScreen.screen.everythingLoaded();
                this._loader.loadWinConditions(this._currentScreen.screen.getWinConditions(), Levels[params.cfg].winConditions);
            }
            if(screen === "cinematic"){
                this._loader.loadCinematicConfig(Cinematics[params.cfg], this._currentScreen.screen.getConfig(), this._currentScreen.screen.getStage(), this._currentScreen.screen);
            }
            this._rootStage.add(this._currentScreen.screen.getStage());
        }
    };
    
    return Logic;
    
});