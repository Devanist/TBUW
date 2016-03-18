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

loader.loadAssets(function(loader, resources){    

    document.addEventListener("keydown", KeyDown, false);

        //var bunny = new PIXI.Sprite(resources.bunny.texture);
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
    // start the timer for the next animation loop
    requestAnimationFrame(animate);
    
	//console.log(ticker.FPS);
    fpsWorker.postMessage(ticker.FPS);
    
    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(rootStage.getStage());
}

    
});