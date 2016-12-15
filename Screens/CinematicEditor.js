define([
    'Core/Screen',
    'Core/Stage',
    'GUI/GUI',
    'json!Assets/Gfx/sprites.json',
    'jquery'
],
function(Screen, Stage, GUI, Spritesheet, $){

    var CinematicEditor = function(){
        Screen.call(this);

        this._config = {
            frames: [],
            music: "",
            music_offset: 0,
            animations: []
        };

        this._currentAnimation = null;

        this._maxTime = 0;
        this._play = false;
        this._currentTime = 0;

        this._finished = false;
        this._currentPlayingAnimation = 0;
        this._stepCounter = 0;
        this._animationComplete = false;
        this._animatedObject = null;
        this._startTime = 0;

        $("head").append('<link rel="stylesheet" href="Assets/Editor/editor.css"/>');
        this.appendToolBox();
        this.appendAssetsLibrary();
    };

    CinematicEditor.prototype = Object.create(Screen.prototype, {
        constructor: {
            value: CinematicEditor,
            enumerable: false,
            configurable: true,
            writable: true
        }
    });

    var _p = CinematicEditor.prototype;

    _p.appendToolBox = function(){
        $("canvas").after('<section id="toolbox"></section>');
        $("#toolbox").append(
            '<p>Click generate and then "Save link as" the Download link</p>' +
            '<a id="download" class="hidden" download="filename.json">Download</a><br/>' + 
            '<input id="save_button" type="button" value="Generate"/>' + 
            '<input id="load_button" type="file" value="Load"/><br/>' +
            '<input type="button" id="add_new_button" value="Add new element"><br/>' + 
            'Time: <input type="range" id="timeBar" min="0" value="0" max="0"/><input id="timeInput" type="text" value="0:00" style="width: 35px;"><br/>' +
            '<input type="button" id="play" value="Play"/><br/>' +
            '<div id="elementsListPanel">' +
                '<h2>Animations list</h2>' + 
                '<section id="animations_list">'+
                    '<ul id="elements_list"></ul>'+ 
                '</section>' +
            '</div>'
        );

        $("#elements_list").on("click", (e) => {
            this._currentAnimation = this._config.animations[e.target.id];
            fillWithProps.call(this);
            $("#props").removeClass("hidden");
        });

        $("#load_button").on("change", (e) => {
            let file = e.target.files[0];
            if(!file){
                return;
            }
            let reader = new FileReader();
            reader.onload = (e) => {
                let contents = JSON.parse(e.target.result);
                
                this._config = contents;

                $("#elements_list").empty();
                
                this._config.animations.
                    map(stateToList).
                    forEach( (item) => {
                        $("#elements_list").append(item);
                    });

                this._maxTime = 0;
                for(var item in this._config.animations){
                    this._maxTime += this._config.animations[item].moveTo.time + this._config.animations[item].moveTo.wait;
                }

                $("#timeBar").prop("max", this._maxTime);

                this.updateStage();
            };
            reader.readAsText(file);
        });

        $("#add_new_button").on("click", () => {
            this._currentAnimation = {
                id: "",
                moveTo: {
                    x: 0,
                    y: 0,
                    time: 0,
                    wait: 0
                }
            };
            $("#info").text("Adding new element");
            $("#save_anim, #cancel, #sprite_select").removeClass("hidden");
        });

        $("#play").on("click", () => {

            this._play = !this._play;

            if(this._play){
                this._stage._stage.alpha = 1;
                $("#play").val("Stop");
                this._currentTime = 0;
                this._startTime = Date.now();

                this._finished = false;
                this._currentPlayingAnimation = 0;
                this._stepCounter = 0;
                this._animationComplete = false;
                this._animatedObject = null;
            }
            else{
                $("#play").val("Play");
                $("#timeBar").val(0);
                this._stage._elements.forEach(moveToInitialPosition);
                this._currentTime = 0;

                this._finished = false;
                this._currentPlayingAnimation = 0;
                this._stepCounter = 0;
                this._animationComplete = false;
                this._animatedObject = null;
                this._play = false;
            }

        });

        $("#save_button").on("click", () => {
            let data = JSON.stringify(this._config);
            let linkData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(data);
            $("#download").
                attr("href", linkData).
                removeClass("hidden");
        });

    };

    _p.appendAssetsLibrary = function(){
        $("canvas").after('<section id="library"></section>');

        $("#library").append(
            '<p id="info">Add new animation or edit existing one</p>' +
            '<p id="sprite_select" class="hidden">Select sprite: <select name="assets_list" id="assets" size="1"></select></p>' +
            '<input class="hidden" type="button" id="save_anim" value="Add" /><input class="hidden" type="button" id="cancel" value="cancel"/>' +
            '<section id="props" class="hidden">'+
                'Move to x: <input type="number" id="moveToX"/>' + 
                'y: <input type="number" id="moveToY" />' +
                'time of animation: <input type="number" id="time"/>' +
                'time to wait after animation complete: <input type="number" id="wait" />' +
            '</section>'
        );

        for(let asset in Spritesheet.frames){
            if(Spritesheet.frames.hasOwnProperty(asset)){
                $("#assets").append('<option value="' + asset + '">' + asset + '</option>');
            }
        }

        $("#save_anim").on("click", () => {
            this._currentAnimation.id = $("#assets option:selected").val();
            $("#props").removeClass("hidden");
            $("#save_anim, #cancel").addClass("hidden");

            $("#elements_list").append(stateToList.call(this, this._currentAnimation, this._config.animations.length));

            fillWithProps.call(this);

            if(this._config.frames.findIndex( (item) => {item === this._currentAnimation.id}) === -1){
                this._config.frames.push(this._currentAnimation.id);
            }
            this._config.animations.push(this._currentAnimation);

            this.updateStage();

        });

        $("#cancel").on("click", () => {
            this._currentAnimation = null;
            $("#info").text("Add new animation or edit existing one");
        });

        $("#assets").on("change", () => {
            this._currentAnimation.id = $("#assets option:selected").val();
            this.updateStage();
        });

        $("#moveToX").on("change", () => {
            this._currentAnimation.moveTo.x = parseInt($("#moveToX").val());
        });

        $("#moveToY").on("change", () => {
            this._currentAnimation.moveTo.y = parseInt($("#moveToY").val());
        });

        $("#time").on("change", () => {
            this._currentAnimation.moveTo.time = parseInt($("#time").val());
        });

        $("#wait").on("change", () => {
            this._currentAnimation.moveTo.wait = parseInt($("#wait").val());
        });

    };

    _p.updateStage = function(){
        this._stage.removeAll();

        this._config.frames.forEach(addToStage.bind(this));
    };

    _p.play = function(start){

        if(!this._finished){
        
            let diff = 0;
            if(this._currentPlayingAnimation < this._config.animations.length){
                
                this._animatedObject = this._stage.getElement(this._config.animations[this._currentPlayingAnimation].id);
                
                if(this._animationComplete === false){
                    if(this._config.animations[this._currentPlayingAnimation].moveTo.time === 0){
                        this._animatedObject.setPosition({x: this._config.animations[this._currentPlayingAnimation].moveTo.x, y: this._config.animations[this._currentPlayingAnimation].moveTo.y});
                        this._animationComplete = true;
                    }
                    else{
                        if(this._stepCounter === 0){
                            this._step = {
                                x: -(this._animatedObject.getPosition().x - this._config.animations[this._currentPlayingAnimation].moveTo.x) / this._config.animations[this._currentPlayingAnimation].moveTo.time,
                                y: -(this._animatedObject.getPosition().y - this._config.animations[this._currentPlayingAnimation].moveTo.y) / (this._config.animations[this._currentPlayingAnimation].moveTo.time / 16.666)
                            };
                        }
                        this._animatedObject.move(this._step);
                        this._stepCounter++;
                        if(this._stepCounter >= this._config.animations[this._currentPlayingAnimation].moveTo.time / 16.666){
                            this._animatedObject.setPosition({x: this._config.animations[this._currentPlayingAnimation].moveTo.x, y: this._config.animations[this._currentPlayingAnimation].moveTo.y});
                            this._animationComplete = true;
                            this._beginTime = 0;
                            this._stepCounter = 0;
                        }
                    }
                }
                
                else{
                    if(this._config.animations[this._currentPlayingAnimation].moveTo.wait === 0){
                        this._currentPlayingAnimation++;
                        this._animationComplete = false;
                    }
                    else{
                        if(this._beginTime === 0){
                            this._beginTime = Date.now();
                        }
                        let diff = Date.now() - this._beginTime;
                        if(diff >= this._config.animations[this._currentPlayingAnimation].moveTo.wait){
                            this._currentPlayingAnimation++;
                            this._animationComplete = false;
                            this._step = 0;
                        }
                    }
                }
                
            }
            else{
                this._finished = true;
            }
        }
        else{
            if(this._stage._stage.alpha > -1){
                this._stage._stage.alpha -= 0.01;
            }
            else{
                $("#play").val("Play");
                $("#timeBar").val(0);
                this._stage._elements.forEach(moveToInitialPosition);
                this._currentTime = 0;

                this._finished = false;
                this._currentPlayingAnimation = 0;
                this._stepCounter = 0;
                this._animationComplete = false;
                this._animatedObject = null;
                this._play = false;
            }
        }

        let allDiff = Date.now() - this._startTime;
        $("#timeBar").val(allDiff);
        let minutes = parseInt(allDiff / 60000);
        let seconds = parseInt((allDiff - 60000 * minutes) / 1000);
        $("#timeInput").val(`${minutes}:${seconds}`);

    };

    _p.update = function(){

        if(this._play){
            this.play();
        }
        else{

        }

        return {action: this._onUpdateAction, params: this._nextScreenParams, changeTo: this._nextScreen, playSound: this._sounds};
    };

    function stateToList(animation, index){
        return `<li id="${index}">${index}.${animation.id}</li>`;
    }

    function sum(item){
        return parseInt(item.time) + parseInt(item.wait);
    }

    function addToStage(frame){
        this._stage.add(new GUI.Image(frame, {x: -2000, y: -2000}, PIXI.Texture.fromFrame(frame)));
    }

    function fillWithProps(){

        $("#assets option").prop("checked", false);
        $(`#assets option:contains($(this._currentAnimation.id)`).prop("checked", true);

        $("#moveToX").val(this._currentAnimation.moveTo.x);
        $("#moveToY").val(this._currentAnimation.moveTo.y);
        $("#time").val(this._currentAnimation.moveTo.time);
        $("#wait").val(this._currentAnimation.moveTo.wait);
    }

    function moveToInitialPosition(item){
        item.setPosition({x: -2000, y: -2000});
    }

    return CinematicEditor;

});