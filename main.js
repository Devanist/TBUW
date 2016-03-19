define([
    './lib/pixi.js',
    './Core/Loader',
    './Core/Logic',
    './Core/Stage',
    './Entities/Entities',
    './Core/Levels'
    ], function(PIXI, Loader, Logic, Stage, Entities, Levels){

var renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);
renderer.backgroundColor = 0xFFFFFF;

document.body.appendChild(renderer.view);

var ticker = new PIXI.ticker.Ticker();
var rootStage = new Stage();
var loader = new Loader();
var logic = new Logic();
var fpsWorker = new Worker('fps.js');

loader.setProgressCb(function(){
    loader.incrementLoadedAssets();
    console.log('Loaded ' + loader.assetsLoaded() + ' of total ' + loader.allAssets());
});
loader.loadAssets(function(datloader, resources){    

    loader.setResources(resources);
    
    document.addEventListener("keydown", KeyDown, false);

    var gameStage = new Stage();
    loader.loadStageConfig(gameStage, Levels.one.entities);
    console.log(gameStage);
    rootStage.add(gameStage);

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