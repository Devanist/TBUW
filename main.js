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
    'Entities/Entities',
    'Core/Levels'
    ], function(PIXI, Loader, Logic, Stage, Entities, Levels){

    var w = window.innerWidth,
        h = window.innerHeight,
        scale = window.innerWidth / 1280;

    var renderer = new PIXI.WebGLRenderer(w, h);
    renderer.backgroundColor = 0xFFFFFF;
    renderer.autoResize = true;
    
    window.onresize = function (event){    
        w = window.innerWidth;    
        h = window.innerHeight;
        scale = window.innerWidth / 1280;    
        renderer.view.style.width = w + "px";    
        renderer.view.style.height = h + "px";
        rootStage.setScale({x: scale, y: scale});    
        renderer.resize(w,h);
    };

    document.body.appendChild(renderer.view);

    var ticker = new PIXI.ticker.Ticker();
    var rootStage = new Stage();
    var loader = new Loader();
    var logic = new Logic();
    var fpsWorker = new Worker('fps.js');

    //Showing progress of loading assets.
    loader.setProgressCb(function(){
        loader.incrementLoadedAssets();
        console.log('Loaded ' + loader.assetsLoaded() + ' of total ' + loader.allAssets());
    });
    loader.loadAssets(function(datloader, resources){    

        //Here assets are loaded, init the game.
        loader.setResources(resources);

        document.addEventListener("keydown", KeyDown, false);

        var gameStage = new Stage();
        loader.loadStageConfig(gameStage, Levels.one.entities);
        rootStage.add(gameStage);
        rootStage.setScale({x: scale, y: scale});

        animate();

        function KeyDown(e) {
            // Klawisz strzałka w lewo
            if (e.keyCode == 37) {
                bunny.position.x -= 5; 
            } 
            // Klawisz strzałka w prawo
            else if (e.keyCode == 39) {
                bunny.position.x += 5;
            } 
            // Klawisz spacja
            else if (e.keyCode == 32){
                
            }
        }
    });

    function animate() {
        requestAnimationFrame(animate);

        fpsWorker.postMessage(ticker.FPS);
        
        renderer.render(rootStage.getStage());
    }

    
});