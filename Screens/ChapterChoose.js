define([
    'Core/Screen'
],
function(Screen){
    
    var ChapterChoose = function(){
        
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