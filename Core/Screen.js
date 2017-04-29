import Stage from './Stage';
    
class Screen{

    constructor(){
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
    }

    /**
     * Returns the background stage.
     */
    getBackgroundStage(){
        return this._background;
    }
    
    /**
     * This function needs to be overloaded in your Screen. Here you should load assets.
     */
    getMainStage(){
        
    }
    
    /**
     * Here you do all your logic updating. Should be overloaded, but return as here.
     */
    update(){
        return {action: this._onUpdateAction, changeTo: this._nextScreen, playSound: this._sounds};
    }
    
    /**
     * Returns the parent stage for rendering.
     */
    getStage(){
        return this._stage;
    }

    getGUIStage(){
        return this._guiStage;
    }

    /** 
     * Here place all callbacks for GUI elements that are created by loader from config.
     * Needs to be overloaded.
    */
    everythingLoaded(){

    }

}

export default Screen;