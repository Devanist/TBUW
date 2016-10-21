define([
    'Core/Screen',
    'Core/Stage',
    'Entities/Entities',
    'json!Assets/Gfx/sprites.json',
    'json!Assets/assets.json',
    'jquery'
], 
function(Screen, Stage, Entities, Spritesheet, Assets, $){
    
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

        this.startClick = {
            x: 0,
            y: 0
        };
        
        this._level = {
            name : "",
            music: "",
            background: [],
            winConditions: [
                
            ],
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

    _p.setWinCondition = function(name, value){
        for(let i = 0; i < this._level.winConditions.length; i++){
            if(this._level.winConditions[i].name === name){
                this._level.winConditions[i].value = value;
            }
        }
    };

    _p.getWinCondition = function(name){
        for(let i = 0; i < this._level.winConditions.length; i++){
            if(this._level.winConditions[i].name === name){
                return this._level.winConditions[i].value;
            }
        }
    };

    _p.getElement = function(id){
        for(var i = 0; i < this._level.entities.length; i++){
            if(this._level.entities[i] && this._level.entities[i].id === parseInt(id)){
                return this._level.entities[i];
            }
        }
        return null;
    };

    _p.getElementIndex = function(id){
        for(var i = 0; i < this._level.entities.length; i++){
            if(this._level.entities[i] && this._level.entities[i].id === parseInt(id)){
                return i;
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
                '<input id="load_button" type="file" value="Load"/><br/>' + 
                '<div class="toolbox_div">Level background: <select id="level_background" size="1"></select></div>' +
                '<div class="toolbox_div">Level music: <select id="level_music" size="1"></select></div>' +
                '<div id="winConditionsPanel" class="panelInactive">' +
                    '<span title="Click to edit win conditions."><></span>' +
                    '<div id="winConditionsPanelContent">' +
                        '<h2>Win conditions</h2>' +
                        '<ul>' +
                            '<li><input type="checkbox" id="enableBlockCoin">Amount of BlockCoins: <input disabled id="wcBlockCoin" value="0" type="number"></input></li>' +
                            '<li><input type="checkbox" id="enablePosition">Position: <br/>'+
                                'X of left upper corner: <input disabled type="number" id="wcPositionXL" value="0"><br/>' +
                                'Y of left upper corner: <input disabled type="number" id="wcPositionYL" value="0">'+
                                'X of right lower corner: <input disabled type="number" id="wcPositionXR" value="0">' +
                                'Y of right lower corner: <input disabled type="number" id="wcPositionYR" value="0">' + 
                            '</li>' + 
                        '</ul>' + 
                    '</div>' +
                '</div>' +
                '<div id="elementsListPanel">' +
                    '<h2>Elements list</h2>' +
                    '<input type="button" id="add_new_button" value="Add new element">' + 
                    '<section id="used_elements"><ul id="elements_list"></ul></section>' +
                '</div>' + 
            '</section>'
        );

        
        for(let asset in Spritesheet.frames){
            if(Spritesheet.frames.hasOwnProperty(asset)){
                $("#level_background").append('<option value="' + asset + '">' + asset + '</option>');
            }
        }

        for(let i = 0; i < Assets.sounds.length; i++){
            $("#level_music").append('<option value="' + Assets.sounds[i].name + '">' + Assets.sounds[i].name + '</option>');
        }

        $("#winConditionsPanelContent").hide();

        $("#level_music").on("change", function(){
            this._level.music = $("#level_music").val();
        }.bind(this));

        $("#enableBlockCoin").on("change", function(){
            if($("#enableBlockCoin").prop("checked")){
                $("#wcBlockCoin").removeAttr("disabled");
                this._level.winConditions.push({
                    name: "BlockCoin",
                    value: $("#wcBlockCoin").val()
                });
            }
            else{
                $("#wcBlockCoin").attr("disabled", "");
                for(let i = 0; i < this._level.winConditions.length; i++){
                    if(this._level.winConditions[i].name === "BlockCoin"){
                        this._level.winConditions.splice(i, 1);
                    }
                }
            }
            console.log(this._level.winConditions);
        }.bind(this));

        $("#enablePosition").on("change", function(){
            if($("#enablePosition").prop("checked")){
                $("#wcPositionXL, #wcPositionXR, #wcPositionYL, #wcPositionYR").removeAttr("disabled");
                this._level.winConditions.push({
                    name: "position",
                    value: {
                        lu: {
                            x: parseInt($("#wcPositionXL").val()),
                            y: parseInt($("#wcPositionYL").val())
                        },
                        rd: {
                            x: parseInt($("#wcPositionXR").val()),
                            y: parseInt($("#wcPositionYR").val())
                        }
                    }
                });
            }
            else{
                $("#wcPositionXL, #wcPositionXR, #wcPositionYL, #wcPositionYR").attr("disabled", "");
                for(let i = 0; i < this._level.winConditions.length; i++){
                    if(this._level.winConditions[i].name === "position"){
                        this._level.winConditions.splice(i, 1);
                    }
                }
            }
            console.log(this._level.winConditions);
        }.bind(this));

        $("#wcBlockCoin").on("input", function(e){
            this.setWinCondition("BlockCoin", parseInt(e.target.value));
        }.bind(this));

        $("#wcPositionXL, #wcPositionYL, #wcPositionXR, #wcPositionYR").on("input", function(e){
            this.setWinCondition("position", {
                        lu: {
                            x: parseInt($("#wcPositionXL").val()),
                            y: parseInt($("#wcPositionYL").val())
                        },
                        rd: {
                            x: parseInt($("#wcPositionXR").val()),
                            y: parseInt($("#wcPositionYR").val())
                        }
                    });
            console.log(this._level);
        }.bind(this));
        
        $("#add_new_button").on("click", function(e){
            this._curId = 0;
            for(let i = 0; i < this._level.entities.length; i++){
                if(this._curId <= this._level.entities[i].id){
                    this._curId = this._level.entities[i].id + 1;
                }
            }             
            this._selectedElement = {
                id: this._curId,
                type: null,
                texture: null,
                position: {
                    x: 0,
                    y: 0,
                },
                anchor: {
                    x: 0,
                    y: 0
                },
                rotation: 0
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
        
        $("#level_background").on("change", function(){
            if(Spritesheet.frames.hasOwnProperty($("#level_background").val())){
                that._background._elements[0]._sprite.texture = new PIXI.Texture.fromFrame($("#level_background").val());
                that._level.background[0] = {
                    id: 0,
                    type: "Background",
                    position: {
                        x: 0,
                        y: 0
                    },
                    texture: $("#level_background").val(),
                    factor: 0
                };                
            }
        });

        $("#winConditionsPanel span").on("click", function(){
            $("#winConditionsPanelContent").toggle();
            $("#winConditionsPanel").toggleClass("panelInactive");
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
                $("#level_music").val(that._level.music);
                if(that.getWinCondition("BlockCoin")){
                    $("#enableBlockCoin").prop("checked", true);
                    $("#wcBlockCoin").val(that.getWinCondition("BlockCoin"));
                    $("#wcBlockCoin").prop("enabled", "");
                }
                if(that.getWinCondition("position")){
                    $("#enablePosition").prop("checked", true);
                    $("#wcPositionXL").prop("enabled", "");
                    $("#wcPositionXR").prop("enabled", "");
                    $("#wcPositionYL").prop("enabled", "");
                    $("#wcPositionYR").prop("enabled", "");
                    $("#wcPositionXL").val(that.getWinCondition("position").lu.x);
                    $("#wcPositionYL").val(that.getWinCondition("position").lu.y);
                    $("#wcPositionXR").val(that.getWinCondition("position").rd.x);
                    $("#wcPositionYR").val(that.getWinCondition("position").rd.y);
                }
                for(var i = 0; i < that._level.entities.length; i += 1){
                    temp = that._level.entities[i];
                    $("#elements_list").append('<li id="el_' + temp.id +'">'+
                    '<img class="elementUp" title="Move this element up" id="up_' + temp.id + '" src="Assets/Editor/up.png">' +
                    '<img class="elementDown" title="Move this element down" id="down_' + temp.id + '" src="Assets/Editor/down.png">' +
                    '<img class="removeElement" title="Remove this element" id="remove_' + temp.id + 
                    '" src="Assets/Editor/cross.png"/><label id="ll_' + temp.id +'">' + temp.id + ": " + temp.type + '::' + 
                    temp.texture + ' - X:' + temp.position.x + 'Y: ' + temp.position.y + '</label></li>');
                }
            };
            reader.readAsText(file);
        });
        
        $("#level_name").on("change", function(){
            that._level.name = $("#level_name").val();
        });

        $("body").on("click", "ul#elements_list li img.removeElement", function(e){
            var deletingId = e.target.id.substring(7);
            var index;

            for(let i = 0; i < that._level.entities.length; i++){
                if(that._level.entities[i].id === parseInt(deletingId)){
                    index = i;
                }
            }
            that._level.entities.splice(index, 1);
            $("#el_"+deletingId).remove();

            that.updateStage("game");

        });

        $("body").on("click", "ul#elements_list li img.elementUp", function(e){

            var movingId = parseInt(e.target.id.substring(3));
            var movingIndex = that.getElementIndex(movingId);
            
            $("#el_"+movingId).insertBefore("#el_" + that._level.entities[movingIndex - 1].id);

            var movingElement = that._level.entities.splice(movingIndex, 1)[0];
            that._level.entities.splice(movingIndex - 1, 0, movingElement);

            that.updateStage("game");

        });

        $("body").on("click", "ul#elements_list li img.elementDown", function(e){

            var movingId = parseInt(e.target.id.substring(5));
            var movingIndex = that.getElementIndex(movingId);
            
            $("#el_"+movingId).insertAfter("#el_" + that._level.entities[movingIndex + 1].id);

            var movingElement = that._level.entities.splice(movingIndex, 1)[0];
            that._level.entities.splice(movingIndex + 1, 0, movingElement);

            that.updateStage("game");

        });
        
        $("body").on("click", "ul#elements_list li label", function(e){
            that._curId = e.target.id.substring(3);
            that._selectedElement = that.getElement(that._curId);

            that._gameStage.getStage().position.x = -that._selectedElement.position.x;
            that._gameStage.getStage().position.y = -that._selectedElement.position.y;

            $("#message_box").text("").removeClass();
            $("#infotext").text(that.MESSAGES.EDITING_ELEMENT + that._curId);
            $("#position-x").val(that._selectedElement.position.x);
            $("#position-y").val(that._selectedElement.position.y);
            $("#anchor-x").val(that._selectedElement.anchor.x);
            $("#anchor-y").val(that._selectedElement.anchor.y);
            $("#rotation").val(that._selectedElement.rotation);
            $("#entities_list").val(that._selectedElement.type);
            $("#assets").val(that._selectedElement.texture);
            $("#factor").show().val("");
            $("#factor_label").show();
            $("#value").show().val("");
            $("#value_label").hide();
    
            if(that._selectedElement.type === "Background"){
                $("#factor").val(that._selectedElement.factor);
                $("#value").hide();
                $("#value_label").hide();
                $("#MPPosition").hide();
            }
            else if(that._selectedElement.type === "BlockCoin"){
                $("#factor").hide();
                $("#factor_label").hide();
                $("#value").val(that._selectedElement.quantity);
                $("#value, #value_label").show();
                $("#MPPosition").hide();
            }
            else if(that._selectedElement.type === "MovingPlatform"){
                console.log('MP');
                $("#factor").hide();
                $("#factor_label").hide();
                $("#value").hide();
                $("#value_label").hide();
                $("#MPPosition").show();
                $("#startPosX").val(that._selectedElement.startPos.x);
                $("#startPosY").val(that._selectedElement.startPos.y);
                $("#endPosX").val(that._selectedElement.endPos.x);
                $("#endPosY").val(that._selectedElement.endPos.y);
            }
            else{
                $("#factor").hide();
                $("#factor_label").hide();
                $("#value").hide();
                $("#value_label").hide();
                $("#MPPosition").hide();
            }

            $("#details_box").show();
        });

        $("canvas").on("mousedown", function(e){
            if(e.button === 1){
                that.startClick.x = e.clientX;
                that.startClick.y = e.clientY;
            }
        });

        $("canvas").on("mousemove", function(e){
            if(e.button === 1){
                that._gameStage.getStage().position.x += e.clientX - that.startClick.x;
                that._gameStage.getStage().position.y += e.clientY - that.startClick.y;
                that.startClick.x = e.clientX;
                that.startClick.y = e.clientY;
            }
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
                '<label>X:</label><input type="number" id="position-x">'+
                '<label>Y:</label><input type="number" id="position-y">'+
                '<label>Anchor X:</label><input type="number" id="anchor-x" value="0">' +
                '<label>Anchor Y:</label><input type="number" id="anchor-y" value="0"><br/>' +
                '<label>Rotation factor</label><input type="number" id="rotation">' +
                '<label id="factor_label">Factor:</label><input type="number" id="factor">' +
                '<label id="value_label">Value:</label><input type="number" id="value">' +
                '<br/><section id="MPPosition">' +
                    '<label>Start position X:</label><input type="number" id="startPosX">'+
                    '<label>Start position Y:</label><input type="number" id="startPosY">'+
                    '<label>End position X:</label><input type="number" id="endPosX">'+
                    '<label>End position Y:</label><input type="number" id="endPosY">'+
                    '<label>Show element in end position</label><input type="checkbox" id="showInEndPosition">' +
                '</section>'+
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
                $("#level_background").append('<option value="' + asset + '">' + asset + '</option>');
                $("#assets").append('<option value="' + asset + '">' + asset + '</option>');
            }
        }
        
        $("#entities_list").on("input", function(e){
            if(Entities.hasOwnProperty($("#entities_list").val())){
                this._selectedElement.type = $("#entities_list").val();
                if($("#entities_list").val() === "Background"){
                    this._selectedElement.factor = 0;
                    delete this._selectedElement.quantity;
                    $("#factor").show().val(0);
                    $("#factor_label").show();
                    $("#value").hide();
                    $("#value_label").hide();
                    $("#MPPosition").hide();
                }
                else if($("#entities_list").val() === "BlockCoin"){
                    delete this._selectedElement.factor;
                    $("#factor").hide().val("");
                    $("#factor_label").hide();
                    $("#value").val(1);
                    $("#value, #value_label").show();
                    $("#MPPosition").hide();
                }
                else if($("#entities_list").val() === "MovingPlatform"){
                    delete this._selectedElement.quantity;
                    this._selectedElement.factor = 0;
                    $("#factor").show().val(0);
                    $("#factor_label").show();
                    $("#value").hide();
                    $("#value_label").hide();
                    $("#MPPosition").show();
                }
                else {
                    delete this._selectedElement.factor;
                    delete this._selectedElement.quantity;
                    $("#factor").hide().val("");
                    $("#factor_label").hide();
                    $("#value").hide();
                    $("#value_label").hide();
                    $("#MPPosition").hide();
                }
            }
        }.bind(this));
        
        $("#save_entity_button").on("click", function(e){
            if(this._selectedElement === null){
                $("#message_box").text("You must select an element first!");
                $("#message_box").addClass("error_message");
            }
            else if(this.getElement(this._selectedElement.id) !== null && this.getElement(this._selectedElement.id) !== undefined){
                $("#message_box").text("You can't add the same object twice! ID: " + this._selectedElement.id);
                $("#message_box").addClass("error_message");
            }
            else if(this._selectedElement.type !== null && this._selectedElement.type !== undefined &&
                this._selectedElement.texture !== null && this._selectedElement.texture !== undefined){
                    
                if(this._selectedElement.type === "Background"){
                    this._selectedElement.factor = 0;
                }
                else if(this._selectedElement.type === "BlockCoin"){
                    this._selectedElement.quantity = 1;
                }
                else if(this._selectedElement.type === "MovingPlatform"){
                    this._selectedElement.startPos = {
                        x: this._selectedElement.position.x,
                        y: this._selectedElement.position.y
                    };
                    this._selectedElement.endPos = {
                        x: this._selectedElement.position.x,
                        y: this._selectedElement.position.y
                    };
                    $("#startPosX").val(this._selectedElement.position.x);
                    $("#startPosY").val(this._selectedElement.position.y);
                    $("#endPosX").val(this._selectedElement.position.x);
                    $("#endPosY").val(this._selectedElement.position.y);
                }
                
                this._level.entities.push(this._selectedElement);
                if($("li #el_" + this._curId).length === 0){
                    $("#elements_list").append('<li id="el_' + this._curId +'">' +
                    '<img class="elementUp" title="Move this element up" id="up_' + this._curId + '" src="Assets/Editor/up.png">' +
                    '<img class="elementDown" title="Move this element down" id="down_' + this._curId + '" src="Assets/Editor/down.png">' + 
                    '<img class="removeElement" title="Remove this element" id="remove_' + this._curId + '" src="Assets/Editor/cross.png"/><label id="ll_' + this._curId +'">' + this._curId + ": " + this._selectedElement.type + '::' + this._selectedElement.texture + ' - X:' + this._selectedElement.position.x + 'Y: ' + this._selectedElement.position.y + '</label></li>');
                }

                $("#infotext").text(this.MESSAGES.EDITING_ELEMENT + this._curId);
                $("#position-x").val(this._selectedElement.position.x);
                $("#position-y").val(this._selectedElement.position.y);
                $("#anchor-x").val(this._selectedElement.anchor.x);
                $("#anchor-y").val(this._selectedElement.anchor.y);
                $("#rotation").val(this._selectedElement.rotation);
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
                        $("#el_"+this._curId).html('<img class="removeElement" title="Remove this element" id="remove_' + this._curId + '" src="Assets/Editor/cross.png"/>' + this._curId + ": " + this._selectedElement.type + '::' + this._selectedElement.texture + ' - X:' + this._selectedElement.position.x + 'Y: ' + this._selectedElement.position.y);
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
                    $("#el_"+this._selectedElement.id).html('<img class="elementUp" title="Move this element up" id="up_' + this._selectedElement.id + '" src="Assets/Editor/up.png">' +
                    '<img class="elementDown" title="Move this element down" id="down_' + this._selectedElement.id + '" src="Assets/Editor/down.png">' + 
                    '<img class="removeElement" title="Remove this element" id="remove_' + this._curId + '" src="Assets/Editor/cross.png"/>' + this._selectedElement.id + ": " + this._selectedElement.type + '::' + this._selectedElement.texture + ' - X:' + this._selectedElement.position.x + 'Y: ' + this._selectedElement.position.y);
                    break;
                }
            }
        }.bind(this));
        
        $("#position-y").on("change", function(){
            this._selectedElement.position.y = $("#position-y").val();
            for(var i = 0; i < this._gameStage._elements.length; i+=1){
                if(this._selectedElement.id === this._gameStage._elements[i]._id){
                    this._gameStage._elements[i]._sprite.position.y = $("#position-y").val();
                    $("#el_"+this._selectedElement.id).html('<img class="elementUp" title="Move this element up" id="up_' + this._selectedElement.id + '" src="Assets/Editor/up.png">' +
                    '<img class="elementDown" title="Move this element down" id="down_' + this._selectedElement.id + '" src="Assets/Editor/down.png">' + 
                    '<img class="removeElement" title="Remove this element" id="remove_' + this._selectedElement.id + '" src="Assets/Editor/cross.png"/>' + this._selectedElement.id + ": " + this._selectedElement.type + '::' + this._selectedElement.texture + ' - X:' + this._selectedElement.position.x + 'Y: ' + this._selectedElement.position.y);
                    break;
                }
            }
        }.bind(this));

        $("#anchor-x").on("change", function(){
            this._selectedElement.anchor.x = parseFloat( $("#anchor-x").val() );
            this.updateStage("game");
        }.bind(this));

        $("#anchor-y").on("change", function(){
            this._selectedElement.anchor.y = parseFloat( $('#anchor-y').val() );
            this.updateStage("game");
        }.bind(this));

        $("#rotation").on("change", function(){
            this._selectedElement.rotation = parseFloat( $("#rotation").val() );
        }.bind(this));

        $("#factor").on("change", function(){
            this._selectedElement.factor = parseFloat( $("#factor").val() );
        }.bind(this));

        $("#value").on("change", function(){
            this._selectedElement.quantity = parseInt( $("#value").val() );
        }.bind(this));

        $("#startPosX").on("change", function(){
            this._selectedElement.startPos.x = $(this).val();
        });

        $("#startPosY").on("change", function(){
            this._selectedElement.startPos.y = $(this).val();
        });

        $("#endPosX").on("change", function(){
            this._selectedElement.endPos.x = $(this).val();
        });

        $("#endPosY").on("change", function(){
            this._selectedElement.endPos.y = $(this).val();
        });

        $("#showInEndPosition").on("change", function(){
            if($(this).is(':checked')){
                console.log('end')
                that._gameStage.getElement(that._selectedElement.id).setPosition({x: that._selectedElement.endPos.x, y: that._selectedElement.endPos.y});
            }
            else{
                console.log('start')
                that._gameStage.getElement(that._selectedElement.id).setPosition({x: that._selectedElement.startPos.x, y: that._selectedElement.startPos.y});
            }
        });
        
    };
    
    _p.getMainStage = function(){
        return this._gameStage;
    };
    
    _p.update = function(keysState){

        if(keysState.CTRL){

            if(keysState.ARROW_LEFT){
                this._gameStage.getStage().position.x += 100;
            }
            if(keysState.ARROW_RIGHT){
                this._gameStage.getStage().position.x -= 100;
            }
            if(keysState.ARROW_UP){
                this._gameStage.getStage().position.y += 50;
            }
            if(keysState.ARROW_DOWN){
                this._gameStage.getStage().position.y -= 50;
            }

        }        
        
       window.innerHeight = 600;
       window.innerWidth = 960;
       // this._canvas.setAttribute("height", "600");
       // this._canvas.setAttribute("width", "960");
        
        return {action: this._onUpdateAction, changeTo: this._nextScreen, playSound: []};
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
                if(e !== undefined && e !== null){

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
                    else if(e.type === "PositionField"){
                        temp = new Entities.PositionField(e.id);
                    }
                    else if(e.type === "MovingPlatform"){
                        temp = new Entities.MovingPlatform(e.id, PIXI.Texture.fromFrame(e.texture), e.startPos, e.endPos, e.time);
                    }
                    else if(e.type === "LasersFromGround"){
                        temp = new Entities.LasersFromGround(e.id);
                    }
                    temp.setPosition(e.position);
                    if(e.anchor === undefined || e.anchor === null){
                        e.anchor = {
                            x: 0,
                            y: 0
                        };
                    }
                    temp.setAnchor(e.anchor);
                    temp.setRotationAngle(e.rotation);
                    this._gameStage.add(temp);
                    
                }
            }
        }
    };
    
    return LevelEditor;
    
});