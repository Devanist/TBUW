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
        
        this._small = 1;
        if(window.innerWidth <= 640){
            this._small = 2;
        }
        this._sounds = [{name: "home_beforethenight"}];
        this._buttonPressedDown = false;

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

    _p.everythingLoaded = function(){
        this._guiStage.getElement("new_game").
            active(true).
            setCallback(
                () => {
                    this._onUpdateAction = this.EVENT.CHANGE;
                    this._nextScreen = "chapter_choose";
                }
            );

    };
    
    _p.update = function(keysState, clicks, touches){
        var i = 0,j = 0, temp;
        if(this._small === 1){
            this._background._elements[0]._sprite.width = window.innerWidth / (window.innerHeight * 1.6 / 1280);
        }
        else{
            this._background._elements[0]._sprite.width = 640;
        }
        
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
        
        //Mouse clicks handling
        for(j = 0; j < clicks.length; j += 1){
            for(i = 0; i < this._guiStage._elements.length; i += 1){
                temp = this._guiStage._elements[i];
                if(temp._sprite.containsPoint({x: clicks[j].clientX, y: clicks[j].clientY})){
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
        
        return {action: this._onUpdateAction, changeTo: this._nextScreen, playSound: this._sounds, sameMusic: true};
        
    };
    
    return MenuScreen;
    
});