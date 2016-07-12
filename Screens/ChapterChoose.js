define([
    'Core/Screen',
    'json!Assets/Chapters.json',
    'GUI/GUI'
],
function(Screen, cfg, GUI){
    
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
        for(var i = 0; i < this._chapters.length; i++){
            this._stage.add(new GUI.Button(this._chapters[i].name, this._chaptersPositions[i], PIXI.Texture.fromFrame(this._chapters[i].sprite), "", {}, 
                function(){

                }
            ));
            console.log(this._stage);
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
    
    _p.update = function(){
        
        
        
        return  {
            action: this._onUpdateAction,
            changeTo: this._nextScreen,
            playSound: this._sounds
        };
    };
    
    return ChapterChoose;
    
});