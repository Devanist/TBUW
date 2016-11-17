define([
    'Core/Screen',
    'GUI/GUI',
    'Core/Utils'
], 
function(Screen, GUI, Utils){

    var LevelChoose = function(params){
        Screen.call(this);
        this._levels = params.cfg;

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

        this._small = 1;
        if(window.innerWidth <= 640){
            this._small = 2;
        }
        this._sounds = [{name: "home_beforethenight"}];
        this._sameMusic = false;

        this._stage.add(new GUI.Label("RETURN_CHAPTER_CHOOSE_TEXT", {x: 20, y: 10}, "RETURN TO CHOOSING CHAPTER",
            {bitmap: true, font: 20 / this._small + "px Cyberdyne Expanded", fill: 0xffffff, align: "center"}));

        this._stage.add(new GUI.Button("RETURN", {x: 80, y: 80}, PIXI.Texture.fromFrame("backarrow"), "", {},
            function(){
                this._onUpdateAction = "CHANGE";
                this._nextScreen = "chapter_choose";
                this._sameMusic = true;
            }.bind(this)
        ));

        var temp;
        var num;
        var that = this;
        for(let i = 0; i < this._levels.length; i++){
            num = i.toString();
            if(i < 10){
                num = '0' + num;
            }
            if(this._levels[i].type === "cinematic"){
                temp = new GUI.Button("cinem_"+this._levels[i].name, {x: 300 * (i%3 + 1), y: 200 * ((i/3 | 0) + 1)}, PIXI.Texture.fromFrame("cinematic_frame"), num, 
                {size_override: true, bitmap: true, font: 60 / this._small + "px Cyberdyne Expanded", fill: 0xffffff, align: "center"},cinematicCallback);
            }
            else{
                temp = new GUI.Button("level_"+this._levels[i].name, {x: 300 * (i%3 + 1), y: 200 * ((i/3 | 0) + 1)}, PIXI.Texture.fromFrame("frame"), num, 
                {bitmap: true, font: 60 / this._small + "px Cyberdyne Expanded", fill: 0xffffff, align: "center"}, levelCallback);
            }
            if(i === 0){
                temp._data.active = true;
            }
            this._stage.add(temp);
        }

        function cinematicCallback(){
            console.log('run cinematic ' + this._id.substr(6));
            that._onUpdateAction = "CHANGE";
            that._nextScreen = "cinematic";
            that._nextScreenParams = {
                cfg: this._id.substr(6),
                back: that._levels
            };
        }

        function levelCallback(){
            console.log('run level ' + this._id.substr(6));
            that._onUpdateAction = "CHANGE";
            that._nextScreen = "game";
            that._nextScreenParams = {
                cfg: this._id.substr(6),
                back: that._levels
            };
        }

    };

    LevelChoose.prototype = Object.create(Screen.prototype, {
        constructor: {
            value: LevelChoose,
            enumerable: false,
            configurable: true,
            writable: true
        }
    });

    var _p = LevelChoose.prototype;
    
    _p.update = function(keysState, clicks, touches){
        var i = 0, j = 0, temp;

        //Keyboard handling
        if(keysState.ARROW_DOWN || keysState.S){
            if(this._buttonPressedDown === false){
                this._buttonPressedDown = true;
                while(i !== 2){
                    if(j === this._stage._elements.length){
                        j = 0;
                    }
                    temp = this._stage._elements[j];
                    if(temp !== null && temp !== undefined && temp.isEnabled() && temp.isActive()){
                        temp._data.active = false;
                        temp._sprite.filters = null;
                        i = 1;
                        j+=1;
                        continue;
                    }
                    if(i === 1 && temp !== null && temp !== undefined && temp.isEnabled()){
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
                while(i !== 2){
                    if(j === -1){
                        j = this._stage._elements.length - 1;
                    }
                    temp = this._stage._elements[j];
                    if(temp !== null && temp !== undefined && temp.isEnabled() && temp.isActive()){
                        temp._data.active = false;
                        temp._sprite.filters = null;
                        i = 1;
                        j-=1;
                        continue;
                    }
                    if(i === 1 && temp !== null && temp !== undefined && temp.isEnabled()){
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
            for(let i = 0; i < this._stage._elements.length; i+=1){
                temp = this._stage._elements[i];
                if(temp !== null && temp !== undefined && temp.isActive()){
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
            for(j = 0; j < touches.length; j += 1){
                for(i = 0; i < this._stage._elements.length; i += 1){
                    temp = this._stage._elements[i];
                    if(temp._sprite.containsPoint({x: touches[j].pageX, y: touches[j].pageY})){
                        temp.triggerCallback();
                    }                     
                }                    
            }
        }

        for(i = 0; i < this._stage._elements.length; i+=1){
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
            sameMusic: this._sameMusic
        };
    };

    return LevelChoose;

});