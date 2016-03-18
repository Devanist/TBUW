define([
    './lib/pixi.js',
    './Core/Loader',
    './Core/Logic',
    './Core/Stage',
    './Entities/Entities'
    ], function(PIXI, Loader, Logic, Stage, Entities){

var renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);
renderer.backgroundColor = 0xFFFFFF;

var scale = window.innerWidth / 800;

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
loader.loadAssets(function(loader, resources){    

    document.addEventListener("keydown", KeyDown, false);
    
    var p1 = new Entities.Platform(resources.platform.texture);
    
    p1.setPosition({x: 370, y: 380});
    p1.setScale({x: scale, y:scale});

    rootStage.add(p1);

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