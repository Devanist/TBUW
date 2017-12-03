import * as PIXI from 'pixi.js';
import Loader from './Core/Loader';
import Logic from './Core/Logic';
import Stage from './Core/Stage';
import Keyboard from './Core/Keyboard';
import TouchDevice from './Core/TouchDevice';
import Mouse from './Core/Mouse';
import Utils from './Core/Utils';
import Speaker from './Core/Speaker';

var h = window.innerHeight;
var w = window.innerWidth;

var scale;

if (w <= 640) {
    scale = {
        y: h / 360,
        x: w / 640
    };
}
else {
    scale = {
        y : h / 800,
        x : h * 1.6 / 1280 //Not using innerWidth so I can have always 16:10 ratio.
    };
}

//Initialize PIXI and devices.
const Application = new PIXI.Application({
    width : window.innerWidth,
    height : window.innerHeight
});
const loader = new Loader();
const rootStage = new Stage();
const keyboard = new Keyboard();
const speaker = new Speaker();
const touch = new TouchDevice();
const mouse = new Mouse();
rootStage.setScale({ x: scale.x, y: scale.y });
var logic = new Logic(loader, rootStage, speaker, keyboard, mouse, touch);

Application.backgroundColor = 0x000000;
Application.autoResize = true;

window.onresize = function(event){
    h = window.innerHeight;
    w = window.innerWidth;
    if(w <= 640){
        scale = {
            y : h / 360,
            x : w / 640
        };
    }
    else{
        scale = {
            y : h / 800,
            x : h * 1.6 / 1280 //Not using innerWidth so I can have always 16:10 ratio.
        };
    }
    Application.view.style.width = w + "px";
    Application.view.style.height = h + "px";
    rootStage.setScale({ x: scale.x, y: scale.y });
    Application.renderer.resize(w, h);
};

document.body.appendChild(Application.view);
animate();
loader.preload();
//Showing progress of loading assets.
loader.setProgressCb(function(){
    loader.incrementLoadedAssets();
    console.log('Loaded ' + loader.assetsLoaded() + ' of total ' + loader.allAssets());
});
loader.loadAssets(function(datloader, resources){    

    //Here assets are loaded, init the game, set input listeners.
    
    window.addEventListener("keydown", keyboard.handleKeyDown.bind(keyboard), false);
    window.addEventListener("keyup", keyboard.handleKeyUp.bind(keyboard), false);
    
    if (Utils.isTouchDevice()) {
        if (window.PointerEvent) {
            window.addEventListener("pointerdown", touch.handleTouchStart.bind(touch), false);
            window.addEventListener("pointerout", touch.handleTouchEnd.bind(touch), false);
            window.addEventListener("pointercancel", touch.handleTouchCancel.bind(touch), false);
            window.addEventListener("pointermove", touch.handleTouchMove.bind(touch), false);
        }
        else {
            window.addEventListener("touchstart", touch.handleTouchStart.bind(touch), false);
            window.addEventListener("touchend", touch.handleTouchEnd.bind(touch), false);
            window.addEventListener("touchcancel", touch.handleTouchCancel.bind(touch), false);
            window.addEventListener("touchmove", touch.handleTouchMove.bind(touch), false);
        }
    }
    
    window.addEventListener("click", mouse.handleLeftClick.bind(mouse), false);

    logic.run();
    
}, speaker, rootStage);

function animate(){
    Application.stage.addChild(rootStage.getStage());
    requestAnimationFrame(animate);
}