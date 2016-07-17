define([
    'Core/Screen',
    'json!Assets/Chapters.json',
    'GUI/GUI',
    'Core/Utils'
],
function(Screen, cfg, GUI, Utils){
    
    var ChapterChoose = function(){
        Screen.call(this);

        this._small = 1;
        if(window.innerWidth <= 640){
            this._small = 2;
        }

        this._chapters = cfg;
        this._chaptersPositions = [];
        for(var i = 0; i < 2; i++){
            for(var j = 0; j < 3; j++){
                this._chaptersPositions.push({x: 300 * (j + 1), y: 200 * (i + 1)});
            }
        }

        this._stage.add(new GUI.Button("RETURN", {x: 80, y: 80}, PIXI.Texture.fromFrame("backarrow"), "", {},
            function(){
                console.log('returning to menu');
                this._onUpdateAction = "CHANGE";
                this._nextScreen = "menu";
            }.bind(this)
        ));

        for(var i = 0; i < this._chapters.length; i++){
            this._stage.add(new GUI.Button(this._chapters[i].name, this._chaptersPositions[i], PIXI.Texture.fromFrame(this._chapters[i].sprite), "", {}, 
                function(){

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
    
    _p.update = function(keysState, clicks, touches){
        
        //Mouse clicks handling
        for(j = 0; j < clicks.length; j += 1){
            for(i = 0; i < this._stage._elements.length; i += 1){
                temp = this._stage._elements[i];
                if(temp._sprite.containsPoint({x: clicks[j].x, y: clicks[j].y})){
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
            playSound: this._sounds
        };
    };
    
    return ChapterChoose;
    
});