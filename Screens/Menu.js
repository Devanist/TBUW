define([
    'Core/Screen',
    'Core/Stage',
    'GUI/GUI',
    'Entities/Entities',
    'Core/Utils'
], 
function(Screen, Stage, GUI, Entities, Utils){
    
    var MenuScreen = function(){
        Screen.call(this);
        this._guiStage = new Stage();
        
        this._sounds = [];
        
        this._background = new Stage();
        this._background.add(new Entities.Background("background", PIXI.loader.resources.menu.texture, 1));
        
        this._stage.add(this._background);
        
        var new_game = new GUI.Button("new_game", {x: 180, y: 500}, null, "NEW GAME", {bitmap: true, font: "40px Cyberdyne Expanded", fill: 0xffffff, align: "center"}, 
            function(){
                console.log(this);
                this._onUpdateAction = this.EVENT.CHANGE;
                this._nextScreen = "game";
            }.bind(this)
        );
        this._guiStage.add(new_game);
        
        this._stage.add(this._guiStage);
    };
    
    MenuScreen.prototype = Object.create(Screen.prototype, {
       constructor: {
           value: MenuScreen,
           configurable: true,
           writable: true,
           enumerable: false
       } 
    });
    
    var _p = MenuScreen.prototype;
    
    _p.update = function(keysState, clicks, touches){
        
        //Mouse clicks handling
        var l = clicks.length;
        var l2 = this._guiStage._elements.length;
        for(var j = 0; j < l; j += 1){
            for(var i = 0; i < l2; i += 1){
                temp = this._guiStage._elements[i];
                if(temp._sprite.containsPoint({x: clicks[j].x, y: clicks[j].y})){
                    temp.triggerCallback();
                }
            }
        }
        
        //Touch handling
        if(Utils.isTouchDevice()){
            l = touches.length;
            l2 = this._guiStage._elements.length;                
            for(j = 0; j < l; j += 1){
                for(i = 0; i < l2; i += 1){
                    temp = this._guiStage._elements[i];
                    if(temp._sprite.containsPoint({x: touches[j].pageX, y: touches[j].pageY})){
                        temp.triggerCallback();
                    }                     
                }                    
            }
        }
        
        return {action: this._onUpdateAction, changeTo: this._nextScreen, playSound: this._sounds};
        
    };
    
    return MenuScreen;
    
});