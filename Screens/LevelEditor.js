define([
    'Core/Screen',
    'Core/Stage',
    'jquery'
], 
function(Screen, Stage, $){
    
    var LevelEditor = function(){
        Screen.call(this);
        this._background = new Stage();
        this._gameStage = new Stage();
        this._guiStage = new Stage();
        
        this._canvas = $("canvas")[0];
        
        $("body").css("font-family", "Helvetica");
        
        this.appendToolBox();
        
    };
    
    LevelEditor.prototype = Object.create(Screen.prototype, {
        constructor: {
            value: LevelEditor,
            enumerable: false,
            configurable: true,
            writable: true
        }
    });
    
    var _p = LevelEditor.prototype;
    
    _p.appendToolBox = function(){
        
        $(this._canvas).after("<section id='toolbox'></section>");
        $("#toolbox").css({
            "float": "right",
            "background-color": "grey",
            "text-align": "left",
            "width": 640,
            "height": 600
        });
        
        $("#toolbox").append(
            '<input id="level_name" type="text" placeholder="Level name"/>' + 
            '<input id="save_button" type="button" value="Save"/>' + 
            '<input id="load_button" type="button" value="Load"/>' + 
            '<h2>Used elements:</h2>' +
            '<section id="used_elements"><ul id="elements_list"></ul></section>'
        );
    };
    
    _p.getMainStage = function(){
        return this._gameStage;
    };
    
    _p.update = function(){
        
        this._canvas.setAttribute("height", "600");
        this._canvas.setAttribute("width", "960");
        
        return {action: this._onUpdateAction, changeTo: this._nextScreen};
    };
    
    return LevelEditor;
    
});