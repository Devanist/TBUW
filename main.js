define([
    'lib/pixi.js',
    'Core/Loader',
    'Core/Logic',
    'Core/Stage',
    'Core/Keyboard',
    'Core/TouchDevice',
    'Core/Mouse',
    'Core/Utils'
    ], function(PIXI, Loader, Logic, Stage, Keyboard, TouchDevice, Mouse, Utils){

    var h = window.innerHeight;
    var w = h * 1.6;

    var scale = {
        y : h / 800,
        x : w / 1280
    };
        
    var renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);
    var loader = new Loader();
    var rootStage = new Stage();
    var keyboard = new Keyboard();
    var touch = new TouchDevice();
    var mouse = new Mouse();
    rootStage.setScale({ x: scale.x, y: scale.y });
    var logic = new Logic(loader, rootStage, keyboard, mouse, touch);
    //var fpsWorker = new Worker('Core/FPS.js');
    
    renderer.backgroundColor = 0xFFFFFF;
    renderer.autoResize = true;
    
    window.onresize = function (event) {
        h = window.innerHeight;
        w = window.innerWidth;
        scale.y = h / 800;
        scale.x = w / 1280;
        renderer.view.style.width = w + "px";
        renderer.view.style.height = h + "px";
        rootStage.setScale({ x: scale.x, y: scale.y });
        renderer.resize(w, h);
    };

    document.body.appendChild(renderer.view);

    //Showing progress of loading assets.
    loader.setProgressCb(function(){
        loader.incrementLoadedAssets();
        console.log('Loaded ' + loader.assetsLoaded() + ' of total ' + loader.allAssets());
    });
    loader.loadAssets(function(datloader, resources){    

        //Here assets are loaded, init the game, set input listeners.
        loader.setResources(resources);
        
        window.addEventListener("keydown", keyboard.handleKeyDown.bind(keyboard), false);
        window.addEventListener("keyup", keyboard.handleKeyUp.bind(keyboard), false);
        if (Utils.isTouchDevice()) {
            window.addEventListener("touchstart", touch.handleTouchStart.bind(touch), false);
            window.addEventListener("touchend", touch.handleTouchEnd.bind(touch), false);
            window.addEventListener("touchcancel", touch.handleTouchCancel.bind(touch), false);
            window.addEventListener("touchmove", touch.handleTouchMove.bind(touch), false);
        }
        window.addEventListener("click", mouse.handleLeftClick.bind(mouse), false);

        logic.run(animate);
        
        function animate(){
            renderer.render(rootStage.getStage());
            requestAnimationFrame(animate);
        }
        
    });

});