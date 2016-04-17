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
        
        this._stage.add(this._background);
        this._stage.add(this._gameStage);
        
        this._canvas = $("canvas")[0];
        
        $("head").append('<link rel="stylesheet" href="Assets/Editor/editor.css"/>');
        
        this.appendAssetsLibrary();
        this.appendToolBox();
        
        this._level = {
            name : "",
            background: [],
            entities: []
        };
        this._selectedElement = null;
        this._curId = -1;
        
        this.MESSAGES = {
            NO_SELECTION : "Select or create a new element",
            ADDING_ELEMENT : "Adding new element",
            EDITING_ELEMENT: "Editing element #"
        };
        
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
    
    _p.getMainStage = function(){
        return this._gameStage;
    };
    
    _p.appendToolBox = function(){
        
        $(this._canvas).after("<section id='toolbox'></section>");

        $("#toolbox").append(
            '<section id="toolbox_content">' +
                '<input id="level_name" type="text" placeholder="Level name"/>' + 
                '<input id="save_button" type="button" value="Save"/>' + 
                '<input id="load_button" type="button" value="Load"/>' + 
                '<h2>Elements list</h2>' +
                '<input type="button" id="add_new_button" value="Add new element">' + 
                '<section id="used_elements"><ul id="elements_list"></ul></section>' +
            '</section>'
        );
        
        $("#add_new_button").on("click", function(e){
            this._curId = this._level.entities.length;
            this._selectedElement = {
                type: null,
                texture: null,
                position: {
                    x: 0,
                    y: 0
                }
            };
            $("#infotext").text(this.MESSAGES.ADDING_ELEMENT);
        }.bind(this));
        
    };
    
    _p.appendAssetsLibrary = function(){
        var that = this;
        
        $(this._canvas).after('<section id="library"></section>');
        
        $("#library").append(
            '<section id="entity_selection">' +
                '<h5 id="infotext">Select or create a new element</h5>' + 
                '<input list="entities" placeholder="Select an entity" id="entities_list">' +
                '<datalist id="entities"></datalist>' +
                '<input type="button" id="save_entity_button" value="Save">' +
                '<input type="button" id="cancel_editing_button" value="Cancel">' +
                '<p id="message_box"></p>' +
            '</section>' +
            '<section id="asset_selection">' +
                '<input list="assets" placeholder="Select a sprite" id="assets_list">' +
                '<datalist id="assets"></datalist>' +
                '<img id="clear_selection_button" title="Clear selection" src="Assets/Editor/cross.png"/>' +  
                '<img id="sprite_preview" src="Assets/Editor/No_image.png"/>' + 
            '</section>' +
            '<section id="details_box">'+
                '<label>X:</label><input type="text" id="position-x">'+
                '<label>Y:</label><input type="text" id="position-y">'+
            '</section>'
        );
        
        $("#clear_selection_button").on("click", function(e){
            $("#assets_list").val("");
            $("#sprite_preview").attr("src", "Assets/Editor/No_image.png");
        });
        
        for(var entity in Entities){
            if(Entities.hasOwnProperty(entity)){
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
                this._selectedElement.type = $("#entities_list").val();
            }
        }.bind(this));
        
        $("#save_entity_button").on("click", function(e){
            if(this._selectedElement === null){
                $("#message_box").text("You must select an element first!");
                $("#message_box").addClass("error_message");
            }
            else if(this._selectedElement.type !== null && this._selectedElement.type !== undefined &&
                this._selectedElement.texture !== null && this._selectedElement.texture !== undefined){
                this._level.entities[this._curId] = this._selectedElement;
                if($("li #el" + this._curId).length === 0){
                    $("#elements_list").append('<li>' + this._curId + ": " + this._selectedElement.type + '::' + this._selectedElement.texture + '</li>');
                }
                $("#infotext").text(this.MESSAGES.EDITING_ELEMENT + this._curId);
                $("#details_box").show();
                this.updateStage("game");
                console.log(this._gameStage);
                console.log(this._level);
            }
            else{
                $("#message_box").removeClass("error_message");
            }
        }.bind(that));
        
        $("#cancel_editing_button").on("click", function(){
            this._selectedElement = null;
            this._curId = -1;
            $("#message_box").removeClass("error_message");
            $("#message_box").text("");
            $("#infotext").text(this.MESSAGES.NO_SELECTION);
            $("#details_box").hide();
        }.bind(this));
        
        $("#assets_list").on("input", function(e){
            if(PIXI.loader.resources.hasOwnProperty($("#assets_list").val())){
                $("#sprite_preview").attr("src", PIXI.loader.resources[$("#assets_list").val()].url);
                this._selectedElement.texture = $("#assets_list").val();
            }
            else{
                $("#sprite_preview").attr("src", "Assets/Editor/No_image.png");
            }
        }.bind(this));
        
    };
    
    _p.getMainStage = function(){
        return this._gameStage;
    };
    
    _p.update = function(){
        
        this._canvas.setAttribute("height", "600");
        this._canvas.setAttribute("width", "960");
        
        return {action: this._onUpdateAction, changeTo: this._nextScreen};
    };
    
    /**
     * Creates new, updated stage.
     * @param {string} stage
     */
    _p.updateStage = function(stage){
        
        if(stage === "background"){
            this._background._elements.splice(0);
            this._background._stage.removeChild(0);
            this._background.add(new Entities.Background(PIXI.loader.resources[this._level.background[0].texture]));
        }
        else if(stage === "game"){
            this._gameStage.removeAll();
            
            var e = null;
            var temp = null;
            for(var i = 0; i < this._level.entities.length; i+=1){
                e = this._level.entities[i];
                console.log(e);
                if(e.type === "Background"){
                    temp = new Entities.Background(PIXI.loader.resources[e.texture].texture, e.factor);
                }
                else if(e.type === "Platform"){
                    temp = new Entities.Platform(PIXI.loader.resources[e.texture].texture);
                }
                else if(e.type === "Player"){
                    temp = new Entities.Player(e.id, PIXI.loader.resources[e.texture].texture);
                }
                temp.setPosition(e.position);
                this._gameStage.add(temp);
            }
        }
    };
    
    return LevelEditor;
    
});