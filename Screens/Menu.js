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
        
        this._small = 1;
        if(window.innerWidth <= 640){
            this._small = 2;
        }
        this._sounds = [];
        this._buttonPressedDown = false;
        
        this._background = new Stage();
        var bg = new Entities.Background("background", PIXI.Texture.fromFrame('menu'), 1);
        this._background.add(bg);
        console.log(bg._sprite);

        var walluce = new GUI.Image("walluce", "bottom-right", PIXI.Texture.fromFrame('walrus_menu'));
        this._background.add(walluce);
        console.log(walluce);

        this._displacementmap = PIXI.Sprite.fromImage("Assets/Gfx/displacement_map.png");
        this._displacementmap.r = 1;
        this._displacementmap.g = 1;
        this._displacement = new PIXI.filters.DisplacementFilter(this._displacementmap);
        this._displacement.scale.x = 1.5;
        this._displacement.scale.y = 2;
        this._displacement.offset = {
            x: 0,
            y: 0
        };
        
        this._stage.add(this._background);
        
        var new_game = new GUI.Button("new_game", {x: 390 / this._small, y: 500 / this._small}, null, "NEW GAME", {active: true, bitmap: true, font: 40 / this._small + "px Cyberdyne Expanded", fill: 0xffffff, align: "center"}, 
            function(){
                this._onUpdateAction = this.EVENT.CHANGE;
                this._nextScreen = "chapter_choose";
            }.bind(this)
        );
        this._guiStage.add(new_game);
        
        var load_game = new GUI.Button("load_game", {x: 390 / this._small, y: 550 / this._small}, null, "LOAD GAME", {bitmap: true, font: 40 / this._small + "px Cyberdyne Expanded", fill: 0xffffff, align: "center"}, 
            function(){
                this._onUpdateAction = this.EVENT.CHANGE;
                this._nextScreen = "load_game";
            }.bind(this)
        );
        this._guiStage.add(load_game);
        
        var options = new GUI.Button("options", {x: 390 / this._small, y: 600 / this._small}, null, "OPTIONS", {bitmap: true, font: 40 / this._small + "px Cyberdyne Expanded", fill: 0xffffff, align: "center"}, 
            function(){
                this._onUpdateAction = this.EVENT.CHANGE;
                this._nextScreen = "options";
            }.bind(this)
        );
        this._guiStage.add(options);
        
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
        var i = 0,j = 0, temp;
        this._background._elements[0]._sprite.width = window.innerWidth / (window.innerHeight * 1.6 / 1280);
        console.log(this._background._elements[0]._sprite.width);
        
        //Keyboard handling
        if(keysState.ARROW_DOWN || keysState.S){
            if(this._buttonPressedDown === false){
                this._buttonPressedDown = true;
                while(i != 2){
                    if(j == this._guiStage._elements.length){
                        j = 0;
                    }
                    temp = this._guiStage._elements[j];
                    if(temp.isEnabled() && temp.isActive()){
                        temp._data.active = false;
                        temp._text.filters = null;
                        i = 1;
                        j+=1;
                        continue;
                    }
                    if(i == 1 && temp.isEnabled()){
                        temp._data.active = true;
                        i = 2;
                    }
                    else{
                        j+=1;
                    }
                }
            }
        }
        
        if(keysState.ARROW_UP || keysState.W){
            if(this._buttonPressedDown === false){
                this._buttonPressedDown = true;
                while(i != 2){
                    if(j == -1){
                        j = this._guiStage._elements.length - 1;
                    }
                    temp = this._guiStage._elements[j];
                    if(temp.isEnabled() && temp.isActive()){
                        temp._data.active = false;
                        temp._text.filters = null;
                        i = 1;
                        j-=1;
                        continue;
                    }
                    if(i == 1 && temp.isEnabled()){
                        temp._data.active = true;
                        i = 2;
                    }
                    else{
                        j-=1;
                    }
                }
            }
        }
        
        if(keysState.ENTER){
            var l = this._guiStage._elements.length;
            for(i = 0; i < l; i+=1){
                temp = this._guiStage._elements[i];
                if(temp.isActive()){
                    temp.triggerCallback();
                }
            }
        }
        
        if(!keysState.ARROW_DOWN && !keysState.S && !keysState.ARROW_UP && !keysState.W){
            this._buttonPressedDown = false;
        }
        
        //Mouse clicks handling`
        for(j = 0; j < clicks.length; j += 1){
            for(i = 0; i < this._guiStage._elements.length; i += 1){
                temp = this._guiStage._elements[i];
                if(temp._sprite.containsPoint({x: clicks[j].x, y: clicks[j].y})){
                    temp.triggerCallback();
                }
            }
        }
        
        //Touch handling
        if(Utils.isTouchDevice()){           
            for(j = 0; j < touches.length; j += 1){
                for(i = 0; i < this._guiStage._elements.length; i += 1){
                    temp = this._guiStage._elements[i];
                    if(temp._sprite.containsPoint({x: touches[j].pageX, y: touches[j].pageY})){
                        temp.triggerCallback();
                    }                     
                }                    
            }
        }
        
        for(i = 0; i < this._guiStage._elements.length; i+=1){
            temp = this._guiStage._elements[i];
            if(temp.isEnabled() && temp.isActive()){
                if(this._displacement.scale.y < 6){
                    this._displacement.scale.y += 0.1;
                }
                else{
                    this._displacement.scale.y = 1;
                }
                temp._text.filters = [this._displacement];
            }
        }
        
        return {action: this._onUpdateAction, changeTo: this._nextScreen, playSound: this._sounds};
        
    };
    
    return MenuScreen;
    
});