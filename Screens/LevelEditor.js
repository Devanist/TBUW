define([
    'Core/Screen',
    'Core/Stage',
    'Entities/Entities',
    'json!Assets/Gfx/sprites.json',
    'jquery'
], 
function(Screen, Stage, Entities, Spritesheet, $){
    
    var LevelEditor = function(){
        Screen.call(this);
        this._background = new Stage(0, "", 1);
        this._background.add(new Entities.Background());
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

    _p.getElement = function(id){
        for(var i = 0; i < this._level.entities.length; i++){
            if(this._level.entities[i].id === id){
                return this._level.entities[i];
            }
        }
        return null;
    };
    
    _p.appendToolBox = function(){
        
        var that = this;
        
        $(this._canvas).after("<section id='toolbox'></section>");

        $("#toolbox").append(
            '<section id="toolbox_content">' +
                '<input id="level_name" type="text" placeholder="Level name"/>' + 
                '<input id="save_button" type="button" value="Save"/>' + 
                '<input id="load_button" type="file" value="Load"/>' + 
                '<input id="level_background" list="assets" placeholder="Select a sprite for a background">' +
                '<h2>Elements list</h2>' +
                '<input type="button" id="add_new_button" value="Add new element">' + 
                '<section id="used_elements"><ul id="elements_list"></ul></section>' +
            '</section>'
        );
        
        $("#add_new_button").on("click", function(e){
            this._curId = this._level.entities.length;
            this._selectedElement = {
                id: this._curId,
                type: null,
                texture: null,
                position: {
                    x: 0,
                    y: 0
                }
            };
            $("#message_box").text("").removeClass();
            $("#details_box").hide();
            $("#position-x").val(0);
            $("#position-y").val(0);
            $("#factor").val("");
            $("#entities_list").val("");
            $("#assets_list").val("");
            $("#infotext").text(this.MESSAGES.ADDING_ELEMENT);
        }.bind(this));
        
        $("#level_background").on("input", function(){
            if(Spritesheet.frames.hasOwnProperty($("#level_background").val())){
                that._background._elements[0]._sprite.texture = new PIXI.Texture.fromFrame($("#level_background").val());
                that._level.background[0] = {
                    id: 0,
                    type: "background",
                    position: {
                        x: 0,
                        y: 0
                    },
                    texture: $("#level_background").val(),
                    factor: 0
                };                
            }
        });
        
        $("#save_button").on("click", function(){
            var data = JSON.stringify(that._level);
            var linkData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(data);
            window.open(linkData);
        });
        
        $("#load_button").on("change", function(e){
            var file = e.target.files[0];
            if(!file){
                return;
            }
            var reader = new FileReader();
            reader.onload = function(e){
                var contents = e.target.result;
                that._level = JSON.parse(contents);
                $("#level_background").val(that._level.background[0].texture);
                that.updateStage("background");
                that.updateStage("game");
                $("#level_name").val(that._level.name);
                var temp = null;
                for(var i = 0; i < that._level.entities.length; i += 1){
                    temp = that._level.entities[i];
                    $("#elements_list").append('<li id="el_' + temp.id +'"><img title="Remove this element" id="remove_' + temp.id + '" src="Assets/Editor/cross.png"/>' + temp.id + ": " + temp.type + '::' + temp.texture + ' - X:' + temp.position.x + 'Y: ' + temp.position.y + '</li>');
                }
            };
            reader.readAsText(file);
        });
        
        $("#level_name").on("change", function(){
            that._level.name = $("#level_name").val();
        });
        
        $("body").on("click", "ul#elements_list li", function(e){
            that._curId = e.target.id.substring(3);
            that._selectedElement = that._level.entities[that._curId];
            $("#message_box").text("").removeClass();
            $("#infotext").text(that.MESSAGES.EDITING_ELEMENT + that._curId);
            $("#position-x").val(that._selectedElement.position.x);
            $("#position-y").val(that._selectedElement.position.y);
            $("#entities_list").val(that._selectedElement.type);
            $("#assets_list").val(that._selectedElement.texture);
            $("#factor").show().val("");
            $("#factor_label").show();
            $("#value").show().val("");
            $("#value_label").hide();
            if(that._selectedElement.type !== "Background" && that._selectedElement.type !== "BlockCoin"){
                $("#factor").hide();
                $("#factor_label").hide();
                $("#value").hide();
                $("#value_label").hide();
            }
            else if(that._selectedElement.type === "Background"){
                $("#factor").val(that._selectedElement.factor);
                $("#value").hide();
                $("#value_label").hide();
            }
            else if(that._selectedElement.type === "BlockCoin"){
                $("#factor").hide();
                $("#factor_label").hide();
                $("#value").val(that._selectedElement.quantity);
                $("#value, #value_label").show();
            }
            $("#details_box").show();
        });
        
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
                '<select name="assets_list" id="assets" size="1">' +
                '</select>' +
                '<img id="clear_selection_button" title="Clear selection" src="Assets/Editor/cross.png"/>' +  
                '<img id="sprite_preview" src="Assets/Editor/No_image.png"/>' + 
            '</section>' +
            '<section id="details_box">'+
                '<label>X:</label><input type="text" id="position-x">'+
                '<label>Y:</label><input type="text" id="position-y">'+
                '<label id="factor_label">Factor:</label><input type="text" id="factor">' +
                '<label id="value_label">Value:</label><input type="number" id="value">' +
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
        
        for(var asset in Spritesheet.frames){
            if(Spritesheet.frames.hasOwnProperty(asset)){
                $("#assets").append('<option value="' + asset + '">' + asset + '</option>');
            }
        }
        
        $("#entities_list").on("input", function(e){
            if(Entities.hasOwnProperty($("#entities_list").val())){
                this._selectedElement.type = $("#entities_list").val();
                if($("#entities_list").val() === "Background"){
                    this._selectedElement.factor = 1;
                    delete this._selectedElement.quantity;
                    $("#factor").show().val(1);
                    $("#factor_label").show();
                    $("#value").hide();
                    $("#value_label").hide();
                }
                else if($("#entities_list").val() === "BlockCoin"){
                    delete this._selectedElement.factor;
                    $("#factor").hide().val("");
                    $("#factor_label").hide();
                    $("#value").val(1);
                    $("#value, #value_label").show();
                }
                else{
                    delete this._selectedElement.factor;
                    delete this._selectedElement.quantity;
                    $("#factor").hide().val("");
                    $("#factor_label").hide();
                    $("#value").hide();
                    $("#value_label").hide();
                }
            }
        }.bind(this));
        
        $("#save_entity_button").on("click", function(e){
            if(this._selectedElement === null){
                $("#message_box").text("You must select an element first!");
                $("#message_box").addClass("error_message");
            }
            else if(this.getElement(this._selectedElement.id) !== null){
                $("#message_box").text("You can't add the same object twice!");
                $("#message_box").addClass("error_message");
            }
            else if(this._selectedElement.type !== null && this._selectedElement.type !== undefined &&
                this._selectedElement.texture !== null && this._selectedElement.texture !== undefined){
                    
                this._level.entities[this._curId] = this._selectedElement;
                if($("li #el_" + this._curId).length === 0){
                    $("#elements_list").append('<li id="el_' + this._curId +'"><img title="Remove this element" id="remove_' + this._curId + '" src="Assets/Editor/cross.png"/>' + this._curId + ": " + this._selectedElement.type + '::' + this._selectedElement.texture + ' - X:' + this._selectedElement.position.x + 'Y: ' + this._selectedElement.position.y + '</li>');
                }

                $("#infotext").text(this.MESSAGES.EDITING_ELEMENT + this._curId);
                $("#position-x").val(this._selectedElement.position.x);
                $("#position-y").val(this._selectedElement.position.y);
                $("#details_box").show();
                this.updateStage("game");
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
        
        $("#assets").on("change", function(e){
            if(Spritesheet.frames.hasOwnProperty($("#assets option:selected").val())){
                $("#sprite_preview").attr("src", "http://foka.servebeer.com/static/UTCWB/" + $("#assets option:selected").val() + ".png");
                this._selectedElement.texture = $("#assets option:selected").val();
                for(var i = 0; i < this._gameStage._elements.length; i+=1){
                    if(this._selectedElement.id === this._gameStage._elements[i]._id){
                        this._gameStage._elements[i]._sprite.texture = new PIXI.Texture.fromFrame($("#assets option:selected").val());
                        $("#el_"+this._curId).html('<img title="Remove this element" id="remove_' + this._curId + '" src="Assets/Editor/cross.png"/>' + this._curId + ": " + this._selectedElement.type + '::' + this._selectedElement.texture + ' - X:' + this._selectedElement.position.x + 'Y: ' + this._selectedElement.position.y);
                        break;
                    }
                }
            }
            else{
                $("#sprite_preview").attr("src", "Assets/Editor/No_image.png");
            }
        }.bind(this));
        
        $("#position-x").on("change", function(){
            this._selectedElement.position.x = $("#position-x").val();
            for(var i = 0; i < this._gameStage._elements.length; i+=1){
                if(this._selectedElement.id === this._gameStage._elements[i]._id){
                    this._gameStage._elements[i]._sprite.position.x = $("#position-x").val();
                    $("#el_"+this._selectedElement.id).html('<img title="Remove this element" id="remove_' + this._curId + '" src="Assets/Editor/cross.png"/>' + this._selectedElement.id + ": " + this._selectedElement.type + '::' + this._selectedElement.texture + ' - X:' + this._selectedElement.position.x + 'Y: ' + this._selectedElement.position.y);
                    break;
                }
            }
        }.bind(this));
        
        $("#position-y").on("change", function(){
            this._selectedElement.position.y = $("#position-y").val();
            for(var i = 0; i < this._gameStage._elements.length; i+=1){
                if(this._selectedElement.id === this._gameStage._elements[i]._id){
                    this._gameStage._elements[i]._sprite.position.y = $("#position-y").val();
                    $("#el_"+this._selectedElement.id).html('<img title="Remove this element" id="remove_' + this._curId + '" src="Assets/Editor/cross.png"/>' + this._selectedElement.id + ": " + this._selectedElement.type + '::' + this._selectedElement.texture + ' - X:' + this._selectedElement.position.x + 'Y: ' + this._selectedElement.position.y);
                    break;
                }
            }
        }.bind(this));

        $("#factor").on("change", function(){
            this._selectedElement.factor = parseFloat( $("#factor").val() );
        }.bind(this));

        $("#value").on("change", function(){
            this._selectedElement.quantity = parseInt( $("#value").val() );
        }.bind(this));
        
    };
    
    _p.getMainStage = function(){
        return this._gameStage;
    };
    
    _p.update = function(){
        
       window.innerHeight = 600;
       window.innerWidth = 960;
       // this._canvas.setAttribute("height", "600");
       // this._canvas.setAttribute("width", "960");
        
        return {action: this._onUpdateAction, changeTo: this._nextScreen};
    };
    
    /**
     * Creates new, updated stage.
     * @param {string} stage
     */
    _p.updateStage = function(stage){
        
        if(stage === "background"){
            this._background._elements[0]._sprite.texture = new PIXI.Texture.fromFrame($("#level_background").val());
        }
        else if(stage === "game"){
            this._gameStage.removeAll();
            
            var e = null;
            var temp = null;
            for(var i = 0; i < this._level.entities.length; i+=1){
                e = this._level.entities[i];
                if(e.type === "Background"){
                    temp = new Entities.Background(e.id, PIXI.Texture.fromFrame(e.texture), e.factor);
                }
                else if(e.type === "Platform"){
                    temp = new Entities.Platform(e.id, PIXI.Texture.fromFrame(e.texture));
                }
                else if(e.type === "Player"){
                    var frames = [];
                    for(var j = 0; j < 5; j+=1){
                        frames.push(PIXI.Texture.fromFrame('walrus_0000' + j));
                    }
                    temp = new Entities.Player(e.id, frames);
                }
                else if(e.type === "BlockCoin"){
                    temp = new Entities.BlockCoin(e.id, e.quantity);
                }
                temp.setPosition(e.position);
                this._gameStage.add(temp);
            }
        }
    };
    
    return LevelEditor;
    
});