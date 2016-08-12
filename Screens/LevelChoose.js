define([
    'Core/Screen',
    'GUI/GUI',
    'Core/Utils'
], 
function(Screen, GUI, Utils){

    var LevelChoose = function(params){
        Screen.call(this);
        this._levels = params.cfg;

        this._small = 1;
        if(window.innerWidth <= 640){
            this._small = 2;
        }
        this._sounds = ["home_beforethenight"];
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
        for(var i = 0; i < this._levels.length; i++){
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
        
        //Mouse clicks handling
        for(j = 0; j < clicks.length; j += 1){
            for(i = 0; i < this._stage._elements.length; i += 1){
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