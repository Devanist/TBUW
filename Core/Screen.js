define([
    'Core/Stage',
    ], function(Stage){
    
    var Screen = function(){
        this._stage = new Stage();
        this._background = new Stage();
        this._guiStage = new Stage();
        this._sounds = [];
        this.EVENT = {
            RESTART : 'RESTART',
            CHANGE : 'CHANGE',
            UPDATE : 'UPDATE'
        };
        this._onUpdateAction = this.EVENT.UPDATE;
        this._nextScreen = null;
    };
    
    Screen.prototype = {
        
        /**
         * Returns the background stage.
         */
        getBackgroundStage : function(){
            return this._background;
        },
        
        /**
         * This function needs to be overloaded in your Screen. Here you should load assets.
         */
        getMainStage : function(){
            
        },
        
        /**
         * Here you do all your logic updating. Should be overloaded, but return as here.
         */
        update : function(){
            return {action: this._onUpdateAction, changeTo: this._nextScreen, playSound: this._sounds};
        },
        
        /**
         * Returns the parent stage for rendering.
         */
        getStage : function(){
            return this._stage;
        },

        getGUIStage : function(){
            return this._guiStage;
        }
        
    };
    
    return Screen;
    
});