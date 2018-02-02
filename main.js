import * as PIXI from 'pixi.js';
import Loader from './Core/Loader';
import Logic from './Core/Logic';
import Stage from './Core/Stage';
import Keyboard from './Core/Keyboard';
import TouchDevice from './Core/TouchDevice';
import Mouse from './Core/Mouse';
import Utils from './Core/Utils';
import Speaker from './Core/Speaker';
import { isSmallScreen } from './Core/Utils/commonVars';

const MOBILE_WIDTH = 640;
const MOBILE_HEIGHT = 360;

//Initialize PIXI and devices.
const Application = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight
});
const loader = new Loader();
const rootStage = new Stage();
rootStage.setScale(calculateScale());
const keyboard = new Keyboard();
const speaker = new Speaker();
const touch = new TouchDevice();
const mouse = new Mouse();
const logic = new Logic(loader, rootStage, speaker, keyboard, mouse, touch);

Application.backgroundColor = 0x000000;
Application.autoResize = true;

window.onresize = function () {
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    Application.view.style.width = windowWidth + "px";
    Application.view.style.height = windowHeight + "px";
    rootStage.setScale(calculateScale());
    Application.renderer.resize(windowWidth, windowHeight);
};

document.body.appendChild(Application.view);
animate();
loader.preload();

//Showing progress of loading assets.
loader.setProgressCb(function () {
    loader.incrementLoadedAssets();
    console.log('Loaded ' + loader.assetsLoaded() + ' of total ' + loader.allAssets());
});
loader.loadAssets(onAssetsLoaded, speaker, rootStage);

function animate () {
    Application.stage.addChild(rootStage.getStage());
    requestAnimationFrame(animate);
}

function calculateScale () {
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    return isSmallScreen()
        ? {
            x: windowWidth / MOBILE_WIDTH,
            y: windowHeight / MOBILE_HEIGHT
        }
        : {
            // Not using innerWidth so I can have always 16:10 ratio on desktop.
            y: windowHeight / 800, // eslint-disable-line no-magic-numbers
            x: windowHeight * 1.6 / 1280 // eslint-disable-line no-magic-numbers
        };
}

function onAssetsLoaded () {
    addEventListenersOnInputs();
    logic.run();
}

function addEventListenersOnInputs () {
    window.addEventListener("keydown", keyboard.handleKeyDown.bind(keyboard), false);
    window.addEventListener("keyup", keyboard.handleKeyUp.bind(keyboard), false);

    window.addEventListener("click", mouse.handleLeftClick.bind(mouse), false);

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
}
