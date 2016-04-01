require.config({
	paths: {
		text: 'lib/text',
		json: 'lib/json'
	},
	baseUrl: '.'
});
define([
    'lib/pixi.js',
    'Core/Loader',
    'Core/Logic',
    'Core/Stage',
    'Core/Keyboard'
    ], function(PIXI, Loader, Logic, Stage, Keyboard){

    var scale = window.innerHeight / 800;
    var w = window.innerWidth;    
    var h = window.innerHeight;
        
    var renderer = new PIXI.WebGLRenderer(window.innerHeight / 10 * 16, window.innerHeight);
    var ticker = new PIXI.ticker.Ticker();
    var loader = new Loader();
    var rootStage = new Stage();
    var keyboard = new Keyboard();
    rootStage.setScale({ x: scale, y: scale });
    var logic = new Logic(loader, rootStage, keyboard);
    var fpsWorker = new Worker('Core/FPS.js');
    
    renderer.backgroundColor = 0xFFFFFF;
    renderer.autoResize = true;
    
    window.onresize = function (event) {
        w = window.innerHeight / 10 * 16;
        h = window.innerHeight;
        scale = window.innerHeight / 800;
        renderer.view.style.width = w + "px";
        renderer.view.style.height = h + "px";
        rootStage.setScale({ x: scale, y: scale });
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
        logic.run(animate);
        
        function animate(){
            logic.update();
            fpsWorker.postMessage(ticker.FPS);
            renderer.render(rootStage.getStage());
            requestAnimationFrame(animate);
        }
        
    });

});