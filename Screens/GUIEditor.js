define([
    'Core/Screen',
    'Core/Stage',
    'GUI/GUI',
    'json!Assets/Gfx/sprites.json',
    'jquery'
],
function(Screen, Stage, GUI, Spritesheet, $){

    var GUIEditor = function(){
        Screen.call(this);

        this._stage.add(this._background);        
        this._stage.add(this._guiStage);

        $("head").append('<link rel="stylesheet" href="Assets/Editor/editor.css"/>');
        this.appendToolBox();
        this.appendAssetsLibrary();

        this._backgroundElements = [];
        this._guiElements = [];

        this._currentElement = {};
        this._selectedElementLayer = "";
    };

    GUIEditor.prototype = Object.create(Screen.prototype, {
        constructor: {
            value: GUIEditor,
            enumerable: false,
            configurable: true,
            writable: true
        }
    });

    var _p = GUIEditor.prototype;

    _p.appendToolBox = function(){

        $("canvas").after('<section id="toolbox"></section>');
        $("#toolbox").append(
            '<p>Click generate and then "Save link as" the Download link</p>' +
            '<a id="download" class="hidden" download="filename.json">Download</a><br/>' + 
            '<input id="save_button" type="button" value="Generate"/>' + 
            '<input id="load_button" type="file" value="Load"/><br/>' +
            '<input type="button" id="add_new_button" value="Add new element"><br/>' + 
            '<div id="elementsListPanel">' +
                '<h2>GUI elements list</h2>' + 
                '<section id="gui_elements"><ul id="elements_list"></ul></section>' +
                '<h2>Background elements list</h2>' + 
                '<section id="bg_elements"><ul id="bg_elements_list"></ul></section>' +
            '</div>'
        );

        $("#save_button").on("click", () => {
            let data = JSON.stringify(
                {
                    GUI: {
                        children : this._guiElements
                    },
                    Background: {
                        children : this._backgroundElements 
                    }
                }
            );
            let linkData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(data);
            $("#download").
                attr("href", linkData).
                removeClass("hidden");
        });

        $("#elements_list, #bg_elements_list").on("click", (e) => {
            let stage = "background";
            if($(e.target).parent().attr("id") === "elements_list"){
                stage = "gui";
            }
            loadElement.call(this, e.target.id, stage);
        });

        $("#load_button").on("change", (e) => {
            let file = e.target.files[0];
            if(!file){
                return;
            }
            let reader = new FileReader();
            reader.onload = (e) => {
                let contents = JSON.parse(e.target.result);
                this._backgroundElements = contents.Background.children;
                this._guiElements = contents.GUI.children;

                $("#bg_elements_list, #elements_list").empty();

                this._backgroundElements.
                    map(stateToList).
                    forEach( (item) => {
                        $("#bg_elements_list").append(item);
                    });

                this._guiElements.
                    map(stateToList).
                    forEach( (item) => {
                        $("#elements_list").append(item);
                    });

                this.updateStage("background");
                this.updateStage("gui");
            };
            reader.readAsText(file);
        });

        $("#add_new_button").on("click", () => {
            this._currentElement = {
                type: "",
                id: "",
                position : "center",
                move : {
                    x: 0,
                    y: 0
                },
                visible : true
            };
            $("#info").text("Creating new element");
            $("#props").removeClass("hidden");
            resetInputs();
        });

    };

    _p.appendAssetsLibrary = function(){

        $("canvas").after('<section id="library"></section>');

        $("#library").append(
            '<p id="info">Add new element or edit existing one</p>'+
            '<section id="props" class="hidden">' +
                '<section>' + 
                    '<input type="button" id="save_entity_button" value="Add">' +
                    '<input type="button" id="cancel_editing_button" value="Cancel">' +
                    '<input list="layers" placeholder="Select a layer" id="layer_list">' +
                    '<datalist id="layers"><option value="GUI"><option value="Background"></datalist>' +
                    '<input list="types" placeholder="Select type" id="elem_type">' + 
                    '<datalist id="types"></datalist>'+
                    'Unique identifier: <input type="text" id="identifier"/>' +
                '</section>' +
                '<section id="typeProps" class="hidden">' +
                    'Visible: <input type="checkbox" id="visible" />' +
                    'Coordinate position <input type="checkbox" id="positionSystem" />' +
                    '<input type="text" id="positionString" placeholder="ex. center" value="center"/>' +
                    '<input type="number" id="positionX" value="0" disabled />' +
                    '<input type="number" id="positionY" value="0" disabled />' +
                    'Move X: <input type="number" id="moveX" value="0" /> Move Y:<input type="number" id="moveY" value="0" />' +
                    '<label id="textureLabel" class="hidden">Texture: </label><select name="assets_list" id="assets" size="1"></select>' +
                    '<label id="textLabel" class="hidden">Text: </label><input class="hidden" type="text" id="text" />' + 
                    '<label id="optionsLabel" class="hidden">Options</label><section class="hidden" id="options">' +
                         '<label id="size_overrideLabel">Size override</label><input type="checkbox" id="size_override" />' +
                         '<label id="bitmapLabel">Bitmap</label><input type="checkbox" id="bitmap" />' +
                         '<label id="fontSizeLabel">Font size: </label><input type="number" id="fontSize" value="10"/>' +
                         '<label id="fontFamilyLabel">Font family: </label><input type="text" id="fontFamily" value="Arial" />' +
                         '<label id="fillLabel">Fill color: </label><input type="text" id="fill" value="0xffffff"/>' +
                         '<label id="alignLabel">Text align: </label><input type="text" id="align" value="center" />' +
                    '</section>' +
                '</section>' + 
            '</section>'

        );

        for(let type in GUI){
            if(GUI.hasOwnProperty(type)){
                $("#types").append(`<option value="${type}">`);
            }
        }

        for(var asset in Spritesheet.frames){
            if(Spritesheet.frames.hasOwnProperty(asset)){
                $("#assets").append('<option value="' + asset + '">' + asset + '</option>');
            }
        }

        $("#cancel_editing_button").on("click", () => {
            this._currentElement = {};
            this._selectedElementLayer = "";
            $("#info").text("Add new element or edit existing one");
            $("#props").addClass("hidden");
        });

        $("#save_entity_button").on("click", () => {
            if( this._selectedElementLayer !== "" && 
                this._currentElement.type !== null && 
                this._currentElement.type !== undefined &&
                this._currentElement.id !== ""){
                
                switch(this._currentElement.type){
                    case "button":
                        this._currentElement.texture = "";
                        this._currentElement.options = {
                            size_override : false,
                            bitmap : false,
                            fontSize : 10,
                            fontFamily : "Arial",
                            fill : 'white',
                            align : "center"
                        };
                        this._currentElement.text = "";
                        break;
                    case "image":
                        this._currentElement.texture = "";
                        break;
                    case "label":
                        this._currentElement.text = "";
                        this._currentElement.options = {
                            bitmap: false,
                            fontSize : 10,
                            fontFamily : "Arial",
                            fill : 'white',
                            align : "center"
                        };
                        break; 
                }

                switch(this._selectedElementLayer){
                    case "gui":
                        $("#elements_list").append(stateToList(this._currentElement)); 
                        this._guiElements.push(this._currentElement);
                        this.updateStage("gui");
                        break;
                    case "background":
                        $("#bg_elements_list").append(stateToList(this._currentElement));
                        this._backgroundElements.push(this._currentElement);
                        this.updateStage("background");
                        break;
                }

                $("#typeProps").removeClass("hidden");
                $("#info").text(`Editing ${this._selectedElementLayer} item with id ${this._currentElement.id}`);
                displayTypeProps(this._currentElement);

            }
        });

        $("#layer_list").on("change", () => {
            this._selectedElementLayer = $("#layer_list").val().toLowerCase();
        });

        $("#elem_type").on("change", () => {
            this._currentElement.type = $("#elem_type").val().toLowerCase();
        });

        $("#identifier").on("change", () => {
            this._currentElement.id = $("#identifier").val();
            saveElement.call(this, this._selectedElementLayer);
            this.updateStage(this._selectedElementLayer);
        });

        $("#visible").on("change", () => {
                this._currentElement.visible = $("#visible").prop('checked');
                this.updateStage(this._selectedElementLayer);
        });

        $("#positionSystem").on("change", () => {

            if($("#positionSystem").prop('checked')){
                $("#positionString").attr("disabled", "");
                $("#positionX, #positionY").removeAttr("disabled");
                this._currentElement.position = {
                    x: $("#positionX").val(),
                    y: $("#positionY").val()
                };
            }
            else{
                $("#positionX, #positionY").attr("disabled", "");
                $("#positionString").removeAttr("disabled");
                this._currentElement.position = $("#positionString").val();
            }

            saveElement.call(this, this._selectedElementLayer);
            this.updateStage(this._selectedElementLayer);

        });

        $("#positionX, #positionY").on("change", () => {
            this._currentElement.position.x = parseInt($("#positionX").val());
            this._currentElement.position.y = parseInt($("#positionY").val());
            saveElement.call(this, this._selectedElementLayer);
            this.updateStage(this._selectedElementLayer);
        });

        $("#moveX, #moveY").on("change", () => {
            this._currentElement.move.x = parseInt($("#moveX").val());
            this._currentElement.move.y = parseInt($("#moveY").val());
            saveElement.call(this, this._selectedElementLayer);
            this.updateStage(this._selectedElementLayer);
        });

        $("#assets").on("change", () => {
            this._currentElement.texture = $("#assets option:selected").val();
            saveElement.call(this, this._selectedElementLayer);
            this.updateStage(this._selectedElementLayer);
        });

        $("#text").on("change", () => {
            this._currentElement.text = $("#text").val();
            saveElement.call(this, this._selectedElementLayer);
            this.updateStage(this._selectedElementLayer);
        });

        $("#size_override").on("change", () => {
            this._currentElement.options.size_override = $("#size_override").prop("checked");
            saveElement.call(this, this._selectedElementLayer);
            this.updateStage(this._selectedElementLayer);
        });

        $("#bitmap").on("change", () => {
            this._currentElement.options.bitmap = $("#bitmap").prop("checked");
            saveElement.call(this, this._selectedElementLayer);
            this.updateStage(this._selectedElementLayer);
        });

        $("#fontSize").on("change", () => {
            this._currentElement.options.fontSize = $("#fontSize").val();
            saveElement.call(this, this._selectedElementLayer);
            this.updateStage(this._selectedElementLayer);
        });

        $("#fontFamily").on("change", () => {
            this._currentElement.options.fontFamily = $("#fontFamily").val();
            saveElement.call(this, this._selectedElementLayer);
            this.updateStage(this._selectedElementLayer);
        });

        $("#fill").on("change", () => {
            this._currentElement.options.fill = $("#fill").val();
            saveElement.call(this, this._selectedElementLayer);
            this.updateStage(this._selectedElementLayer);
        });

        $("#align").on("change", () => {
            this._currentElement.options.align = $("#align").val();
            saveElement.call(this, this._selectedElementLayer);
            this.updateStage(this._selectedElementLayer);
        });

    };

    _p.update = function(keysState){  
        
       window.innerHeight = 600;
       window.innerWidth = 960;
       // this._canvas.setAttribute("height", "600");
       // this._canvas.setAttribute("width", "960");
        
        return {action: this._onUpdateAction, changeTo: this._nextScreen, playSound: []};
    };

    _p.updateStage = function(stage){

        if(stage === "background"){

            this._background.removeAll();

            this._backgroundElements.
                map(configToElements).
                forEach( (item) => {
                    this._background.add(item);
                });
        }
        else if(stage === "gui"){

            this._guiStage.removeAll();

            this._guiElements.
                map(configToElements).
                forEach( (item) => {
                    this._guiStage.add(item);
                });
        }

        function configToElements( obj ){

            let temp;

            let small = 1;
            if(window.innerWidth <= 640){
                small = 2;
            }

            if(obj.options && obj.options.fontSize && obj.options.fontFamily){
                obj.options.font = `${parseInt(obj.options.fontSize)}px ${obj.options.fontFamily}`;
            }

            let texture = null;
            if(obj.texture !== null && obj.texture !== undefined && obj.texture !== ""){
                texture = PIXI.Texture.fromFrame(obj.texture);
            }

            switch(obj.type){
                case "image":
                    temp = new GUI.Image(obj.id, obj.position, texture);
                    break;
                case "label":
                    temp = new GUI.Label(obj.id, obj.position, obj.text, obj.options);
                    break;
                case "button":
                    temp = new GUI.Button(obj.id, obj.position, texture, obj.text, obj.options);
                    break;
                default: 
                    console.error(`Bad type: ${obj.type}`);
                    break;
            }

            if(obj.move){
                temp.move(obj.move);
            }
            if(obj.visible !== undefined && obj.visible !== null){
                temp.display(obj.visible);
            }
            return temp;

        }
    };

    function saveElement(stage){
        
        let index;
        let array;
        if(stage === "gui"){
            array = this._guiElements;
        }
        else if(stage === "background"){
            array = this._backgroundElements;
        }

        index = array.findIndex( (item) => {
            return this._currentElement.id === item.id;
        });

        array[index] = this._currentElement;

    }

    function loadElement(id, stage){
        switch(stage){
            case "gui":
                this._currentElement = this._guiElements.find( (item) => {
                    return id === item.id; 
                });
                this._selectedElementLayer = "gui";
                break;
            case "background":
                this._currentElement = this._backgroundElements.find( (item) => {
                    return id === item.id; 
                });
                this._selectedElementLayer = "background";
                break;
        }
        displayTypeProps(this._currentElement);
        fillInputsFromElement(this._currentElement, this._selectedElementLayer);
        $("#props, #typeProps").removeClass("hidden");
        $("#info").text(`Editing ${this._selectedElementLayer} item with id ${this._currentElement.id}`);
    }

    function fillInputsFromElement(e, l){
        let layer = "GUI";
        if(l === "background"){
            layer = "Background";
        }

        $("#elem_type").val(e.type);
        $("#identifier").val(e.id);
        $("#visible").prop("checked", e.visible);
        $("#layer_list").val(layer);
        $("#moveX").val(e.move.x);
        $("#moveY").val(e.move.y);

        if(typeof e.position === "string"){
            $("#positionString").val(e.position).removeAttr("disabled");
            $("#positionX").val(e.position.x).attr("disabled", "");
            $("#positionY").val(e.position.y).attr("disabled", "");
            $("#positionSystem").prop("checked", false);
        }
        else{
            $("#positionX").val(e.position.x).removeAttr("disabled");
            $("#positionY").val(e.position.y).removeAttr("disabled");
            $("#positionString").attr("disabled", "");
            $("#positionSystem").prop("checked", true);
        }

        if(e.text !== undefined){
            $("#text").val(e.text);
        }
        if(e.texture !== undefined){
            $("#assets").val(e.texture);
        }

    }

    function stateToList(item){
        return `<li id="${item.id}">${item.id}::${item.type}</li>`;
    }

    function displayTypeProps(item){

        if(item.texture !== undefined){
            $("#textureLabel, #texture").removeClass("hidden");
        }
        if(item.text !== undefined){
            $("#textLabel, #text").removeClass("hidden");
        }
        if(item.options !== undefined){
            $("#optionsLabel, #options").removeClass("hidden"); 
        }
    }

    function resetInputs(){
        $("#texture, #text, #layer_list, #elem_type, #identifier").val("");
        $("#positionX, #positionY").val(0).attr("disabled", "");
        $("#positionString").val("center").removeAttr("disabled");
        $("#positionSystem").prop("checked", false);
        $("#typeProps").addClass("hidden");
    }

    return GUIEditor;

});