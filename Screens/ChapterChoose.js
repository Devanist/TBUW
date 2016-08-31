define([
    'Core/Screen',
    'json!Assets/Chapters.json',
    'GUI/GUI',
    'Core/Utils'
],
function(Screen, cfg, GUI, Utils){
    
    /**
     * Chapter choosing screen.
     * @class
     * @extends Screen
     */
    var ChapterChoose = function(){
        Screen.call(this);

        this._small = 1;
        if(window.innerWidth <= 640){
            this._small = 2;
        }

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

        this._chapters = cfg;
        this._chaptersPositions = [];
        for(let i = 0; i < 2; i++){
            for(var j = 0; j < 3; j++){
                this._chaptersPositions.push({x: 300 * (j + 1), y: 200 * (i + 1)});
            }
        }

        this._stage.add(new GUI.Label("RETURN_MENU_TEXT", {x: 20, y: 10}, "RETURN TO MENU",
            {bitmap: true, font: 20 / this._small + "px Cyberdyne Expanded", fill: 0xffffff, align: "center"}));

        this._stage.add(new GUI.Button("RETURN", {x: 80, y: 80}, PIXI.Texture.fromFrame("backarrow"), "", {},
            () => {
                this._onUpdateAction = "CHANGE";
                this._nextScreen = "menu";
            }
        ));

        var that = this;
        var levels;
        for(let i = 0; i < this._chapters.length; i++){
            levels = this._chapters[i].levels;
            this._stage.add(new GUI.Button(this._chapters[i].name, this._chaptersPositions[i], PIXI.Texture.fromFrame(this._chapters[i].sprite), "", 
            (() => {if(i === 0){ return {active: true};} else { return {};}})(), 
                ()=> {
                    that._onUpdateAction = "CHANGE";
                    that._nextScreen = "level_choose";
                    that._nextScreenParams = {
                        cfg: levels
                    };
                }
            ));
            this._stage.add(new GUI.Label(this._chapters[i].name + "_label", 
                {
                    x: this._chaptersPositions[i].x - 158,
                    y: this._chaptersPositions[i].y + 120
                },
                this._chapters[i].name,
                {bitmap: true, font: 20 / this._small + "px Cyberdyne Expanded", fill: 0xffffff, align: "center"}
            ));
        }
    };
    
    ChapterChoose.prototype = Object.create(Screen.prototype, {
        constructor: {
            value: ChapterChoose,
            enumerable: false,
            configurable: true,
            writable: true
        }
    });
    
    var _p = ChapterChoose.prototype;

    /**
     * Method that handles user input and returns information to the application logic.
     */
    _p.update = function(keysState, clicks, touches){

        var i,j;
        //Keyboard handling
        if(keysState.ARROW_DOWN || keysState.S){
            if(this._buttonPressedDown === false){
                this._buttonPressedDown = true;
                while(i != 2){
                    if(j == this._stage._elements.length){
                        j = 0;
                    }
                    temp = this._stage._elements[j];
                    if(temp.isEnabled() && temp.isActive()){
                        temp._data.active = false;
                        temp._sprite.filters = null;
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
                        j = this._stage._elements.length - 1;
                    }
                    temp = this._stage._elements[j];
                    if(temp.isEnabled() && temp.isActive()){
                        temp._data.active = false;
                        temp._sprite.filters = null;
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
            for(i = 0; i < this._stage._elements.length; i+=1){
                temp = this._stage._elements[i];
                if(temp.isActive()){
                    temp.triggerCallback();
                }
            }
        }
        
        if(!keysState.ARROW_DOWN && !keysState.S && !keysState.ARROW_UP && !keysState.W){
            this._buttonPressedDown = false;
        }
        
        //Mouse clicks handling
        for(let j = 0; j < clicks.length; j += 1){
            for(let i = 0; i < this._stage._elements.length; i += 1){
                temp = this._stage._elements[i];
                if(temp.triggerCallback !== undefined && temp._sprite.containsPoint({x: clicks[j].x, y: clicks[j].y})){
                    temp.triggerCallback();
                }
            }
        }
        
        //Touch handling
        if(Utils.isTouchDevice()){           
            for(let j = 0; j < touches.length; j += 1){
                for(let i = 0; i < this._stage._elements.length; i += 1){
                    temp = this._stage._elements[i];
                    if(typeof temp.triggerCallback === "function" && temp._sprite.containsPoint({x: touches[j].pageX, y: touches[j].pageY})){
                        temp.triggerCallback();
                    }                     
                }                    
            }
        }

        for(let i = 0; i < this._stage._elements.length; i+=1){
            temp = this._stage._elements[i];
            if(temp.isEnabled() && temp.isActive()){
                if(this._displacement.scale.y < 6){
                    this._displacement.scale.y += 0.1;
                }
                else{
                    this._displacement.scale.y = 1;
                }
                temp._sprite.filters = [this._displacement];
            }
        }
        
        return  {
            action: this._onUpdateAction,
            changeTo: this._nextScreen,
            params: this._nextScreenParams,
            playSound: this._sounds,
            sameMusic: true
        };
    };
    
    return ChapterChoose;
    
});