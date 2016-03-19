define(['./Stage'], function(Stage){
    
    var Logic = function(){
        this._stages = {};
        this._scale = window.innerWidth / 800;
    };
    
    Logic.prototype = {
        
        addStage: function(name){
            this._stages[name] = new Stage();
        },
        
        update : function(){
            
        },
        
        getScale : function(){
            return this._scale;
        }
        
    };
    
    return Logic;
    
});