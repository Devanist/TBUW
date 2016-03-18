define(['./Stage'], function(Stage){
    
    var Logic = function(){
        this._stages = {};
    };
    
    Logic.prototype = {
        
        addStage: function(name){
            this._stages[name] = new Stage();
        }
        
    };
    
    return Logic;
    
});