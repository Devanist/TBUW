define([
    'Core/Stage',
    ], function(Stage){
    
    var Screen = function(){
        this._stage = new Stage();
        this.EVENT = {
            RESTART : 'RESTART',
            CHANGE : 'CHANGE',
            UPDATE : 'UPDATE'
        };
        this._onUpdateAction = this.EVENT.UPDATE;
        this._nextScreen = null;
    };
    
    return Screen;
    
});