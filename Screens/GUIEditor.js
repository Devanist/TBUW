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
                        $("#bg_elements_list").append(`<li>${item.id}::${item.type}</li>`);
                    });

                this._guiElements.
                    map(stateToList).
                    forEach( (item) => {
                        $("#elements_list").append(item);
                    });

                function stateToList(item){
                    return `<li>${item.id}::${item.type}</li>`;
                }

                this.updateStage("background");
                this.updateStage("gui");
            };
            reader.readAsText(file);
        });

        $("#add_new_button").on("click", () => {
            this._currentElement = {
                type: "",
                id: "",
                position : "",
            };
            $("#info").text("Creating new element");
            $("#props").removeClass("hidden");
        });

    };

    _p.appendAssetsLibrary = function(){

        $("canvas").after('<section id="library"></section>');

        $("#library").append(
            '<p id="info">Add new element or edit existing one</p>'+
            '<section id="props" class="hidden">' + 
                '<input type="button" id="save_entity_button" value="Add">' +
                '<input type="button" id="cancel_editing_button" value="Cancel">' +
                '<input list="layers" placeholder="Select a layer" id="layer_list">' +
                '<datalist id="layers"><option value="GUI"><option value="Background"></datalist>' +
                '<input list="types" placeholder="Select type" id="elem_type">' + 
                '<datalist id="types"></datalist>'+ 
            '</section>'
        );

        for(let type in GUI){
            if(GUI.hasOwnProperty(type)){
                $("#types").append(`<option value="${type}">`);
            }
        }

        $("#cancel_editing_button").on("click", () => {
            this._currentElement = {};
            $("#info").text("Add new element or edit existing one");
            $("#props").addClass("hidden");
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
            console.log(this._backgroundElements);
        }
        else if(stage === "gui"){
            console.log(this._guiElements);
        }
    };

    return GUIEditor;

});