define([
    'Core/Screen',
    'Core/Stage',
    'Entities/Entities',
    'jquery'
], 
function(Screen, Stage, Entities, $){
    
    var LevelEditor = function(){
        Screen.call(this);
        this._background = new Stage();
        this._gameStage = new Stage();
        this._guiStage = new Stage();
        
        this._canvas = $("canvas")[0];
        
        $("head").append('<link rel="stylesheet" href="Assets/Editor/editor.css"/>');
        
        this.appendAssetsLibrary();
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

        $("#toolbox").append(
            '<section id="toolbox_content">' +
                '<input id="level_name" type="text" placeholder="Level name"/>' + 
                '<input id="save_button" type="button" value="Save"/>' + 
                '<input id="load_button" type="button" value="Load"/>' + 
                '<h2>Used elements:</h2>' +
                '<section id="used_elements"><ul id="elements_list"></ul></section>' +
            '</section>'
        );
    };
    
    _p.appendAssetsLibrary = function(){
        
        $(this._canvas).after('<section id="library"></section>');
        
        $("#library").append(
            '<section id="entity_selection">' +
                '<input list="entities" placeholder="Select an entity" id="entities_list">' +
                '<datalist id="entities"></datalist>' +
                '<input type="button" id="add_entity_button" value="Add entity">' +
            '</section>' +
            '<section id="asset_selection">' +
                '<input list="assets" placeholder="Select a sprite" id="assets_list">' +
                '<datalist id="assets"></datalist>' +
                '<img id="clear_selection_button" title="Clear selection" src="Assets/Editor/cross.png"/>' +  
                '<img id="sprite_preview" src="Assets/Editor/No_image.png"/>' + 
            '</section>'
        );
        
        $("#clear_selection_button").on("click", function(e){
            $("#assets_list").val("");
            $("#sprite_preview").attr("src", "Assets/Editor/No_image.png");
        });
        
        for(var entity in Entities){
            if(Entities.hasOwnProperty(entity) && entity !== "Player"){
                $("#entities").append('<option value="' + entity +'">');
            }
        }
        
        for(var asset in PIXI.loader.resources){
            if(PIXI.loader.resources.hasOwnProperty(asset)){
                $("#assets").append('<option value="' + asset + '">');
            }
        }
        
        $("#entities_list").on("input", function(e){
            if(Entities.hasOwnProperty($("#entities_list").val())){
                
            }
        });
        
        $("#assets_list").on("input", function(e){
            if(PIXI.loader.resources.hasOwnProperty($("#assets_list").val())){
                $("#sprite_preview").attr("src", PIXI.loader.resources[$("#assets_list").val()].url);
                console.log(PIXI.loader.resources);
            }
            else{
                $("#sprite_preview").attr("src", "Assets/Editor/No_image.png");
            }
        });
        
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