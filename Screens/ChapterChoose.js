define([
    'Core/Screen',
    'json!Assets/Chapters.json',
    'GUI/GUI'
],
function(Screen, cfg, GUI){
    
    var ChapterChoose = function(){
        Screen.call(this);
        this._chapters = cfg;
        this._chaptersPositions = [];
        for(var i = 0; i < 2; i++){
            for(var j = 0; j < 3; j++){
                this._chaptersPositions.push({x: 300 * j, y: 250 * i});
            }
        }

        for(var i = 0; i < this._chapters.length; i++){
            this._stage.add(new GUI.Button(this._chapters[i].name, this._chaptersPositions[i], this._chapters[i].sprite, "", {}, 
                function(){

                }
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