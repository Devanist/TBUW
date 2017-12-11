import Screen from '../Core/Screen';
import GUI from '../GUI/GUI';
import Spritesheet from '../Assets/Gfx/sprites.json';
import $ from 'jquery';
import Assets from '../Assets/assets.json';

class CinematicEditor extends Screen {
    constructor () {
        super();

        this._config = {
            frames: [],
            music: "",
            music_offset: 0,
            animations: []
        };

        this._sounds = [];

        this._currentAnimation = null;
        this._musicPlaying = false;

        this._maxTime = 0;
        this._play = false;
        this._currentTime = 0;

        this._finished = false;
        this._currentPlayingAnimationIndex = 0;
        this._stepCounter = 0;
        this._animationComplete = false;
        this._animatedObject = null;
        this._startTime = 0;

        $("head").append('<link rel="stylesheet" href="Assets/Editor/editor.css"/>');
        this.appendToolBox();
        this.appendAssetsLibrary();
    }

    appendToolBox(){
        $("canvas").after('<section id="toolbox"></section>');
        $("#toolbox").append(
            '<p>Click generate and then "Save link as" the Download link</p>' +
            '<a id="download" class="hidden" download="filename.json">Download</a><br/>' + 
            '<input id="save_button" type="button" value="Generate"/>' + 
            '<input id="load_button" type="file" value="Load"/><br/>' +
            '<select id="level_music" size="1"></select><input type="button" id="playMusic" value="Play music"/><input id="timeScreen" type="text" value="0:00" style="width: 35px;">Offset: <input type="text" style="width: 35px;" id="musicOffset" value="0:00" /><br/>' +
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

        for(let i = 0; i < Assets.sounds.length; i++){
            $("#level_music").append('<option value="' + Assets.sounds[i].name + '">' + Assets.sounds[i].name + '</option>');
        }

        $("#level_music").on("change", () => {
            this._config.music = $("#level_music").val();
            this._sounds.push({name: "all", stop: true});
            this._musicPlaying = false;
            $("#playMusic").val("Play music");
        });

        $("#musicOffset").on("change", () => {
            let time = $("#musicOffset").val().split(":");
            let ms = parseInt(time[0]) * 60 + parseInt(time[1]);
            this._config.music_offset = ms;
        });

        $("#playMusic").on("click", () => {
            this._musicPlaying = !this._musicPlaying;
            this._sounds = [
                {
                    name: $("#level_music").val(), 
                    stop: !this._musicPlaying,
                    offset: this._config.music_offset
                }
            ];
            if(this._musicPlaying){
                $("#playMusic").val("Stop music");
                this._startTime = Date.now() - this._config.music_offset * 1000;

                $("#play").val("Play");
                $("#timeBar").val(0);
                this._stage._elements.forEach(moveToInitialPosition);
                this._currentTime = 0;

                this._finished = false;
                this._currentPlayingAnimationIndex = 0;
                this._stepCounter = 0;
                this._animationComplete = false;
                this._animatedObject = null;
                this._play = false;
            }
            else{
                $("#playMusic").val("Play music");
            }
        });

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
                this._currentPlayingAnimationIndex = 0;
                this._stepCounter = 0;
                this._animationComplete = false;
                this._animatedObject = null;

                this._sounds.push({name: "all", stop: true});
                this._musicPlaying = false;
                $("#playMusic").val("Play music");
            }
            else{
                $("#play").val("Play");
                $("#timeBar").val(0);
                this._stage._elements.forEach(moveToInitialPosition);
                this._currentTime = 0;

                this._finished = false;
                this._currentPlayingAnimationIndex = 0;
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

    appendAssetsLibrary(){
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

    updateStage () {
        this._stage.removeAll();
        this._config.frames.forEach(addToStage.bind(this));
    };

    play () {
        if (!this._finished) {

            if (this._currentPlayingAnimationIndex < this._config.animations.length) {
                this._animatedObject = this._stage.getElement(this._config.animations[this._currentPlayingAnimationIndex].id);
                if (this._animationComplete === false) {
                    if (this._config.animations[this._currentPlayingAnimationIndex].moveTo.time === 0) {
                        this._animatedObject.setPosition({x: this._config.animations[this._currentPlayingAnimationIndex].moveTo.x, y: this._config.animations[this._currentPlayingAnimationIndex].moveTo.y});
                        this._animationComplete = true;
                    }
                    else {
                        if (this._stepCounter === 0) {
                            this._step = {
                                x: -(this._animatedObject.getPosition().x - this._config.animations[this._currentPlayingAnimationIndex].moveTo.x) / this._config.animations[this._currentPlayingAnimationIndex].moveTo.time,
                                y: -(this._animatedObject.getPosition().y - this._config.animations[this._currentPlayingAnimationIndex].moveTo.y) / (this._config.animations[this._currentPlayingAnimationIndex].moveTo.time / 16.666)
                            };
                        }
                        this._animatedObject.move(this._step);
                        this._stepCounter++;
                        if (this._stepCounter >= this._config.animations[this._currentPlayingAnimationIndex].moveTo.time / 16.666) {
                            this._animatedObject.setPosition({x: this._config.animations[this._currentPlayingAnimationIndex].moveTo.x, y: this._config.animations[this._currentPlayingAnimationIndex].moveTo.y});
                            this._animationComplete = true;
                            this._beginTime = 0;
                            this._stepCounter = 0;
                        }
                    }
                }
                else {
                    if (this._config.animations[this._currentPlayingAnimationIndex].moveTo.wait === 0) {
                        this._currentPlayingAnimationIndex++;
                        this._animationComplete = false;
                    }
                    else {
                        if (this._beginTime === 0) {
                            this._beginTime = Date.now();
                        }
                        const diff = Date.now() - this._beginTime;
                        if (diff >= this._config.animations[this._currentPlayingAnimationIndex].moveTo.wait) {
                            this._currentPlayingAnimationIndex++;
                            this._animationComplete = false;
                            this._step = 0;
                        }
                    }
                }
                
            }
            else {
                this._finished = true;
            }
        }
        else {
            if (this._stage._stage.alpha > -1) {
                this._stage._stage.alpha -= 0.01;
            }
            else {
                $("#play").val("Play");
                $("#timeBar").val(0);
                this._stage._elements.forEach(moveToInitialPosition);
                this._currentTime = 0;

                this._finished = false;
                this._currentPlayingAnimationIndex = 0;
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

    update () {
        const soundsToPlay = [].concat(this._sounds);
        this._sounds = [];

        if (this._play) {
            this.play();
            $("#timeScreen").val();
        }

        if (this._musicPlaying) {
            let seconds = Date.now() - this._startTime;
            const minutes = parseInt(seconds / 60000);
            seconds = parseInt((seconds - 60000 * minutes) / 1000);
            $("#timeScreen").val(`${minutes}:${seconds}`);
        }

        return {action: this._onUpdateAction, params: this._nextScreenParams, changeTo: this._nextScreen, playSound: soundsToPlay};
    };

}

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

export default CinematicEditor;