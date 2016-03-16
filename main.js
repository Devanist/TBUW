// You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
// which will try to choose the best renderer for the environment you are in.

var renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);

var scale = window.innerWidth / 800;

renderer.backgroundColor = 0xFFFFFF;
// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

var ticker = new PIXI.ticker.Ticker();

// You need to create a root container that will hold the scene you want to draw.
var stage = new PIXI.Container();

// load the texture we need
var loader = new Loader();
loader.loadAssets(function(loader, resources){    

document.addEventListener("keydown", KeyDown, false);
    // This creates a texture from a 'bunny.png' image.
    var bunny = new PIXI.Sprite(resources.bunny.texture);
    var p1 = new Platform(resources.platform.texture);

    // Setup the position and scale of the bunny
    bunny.position.x = 400;
    bunny.position.y = 300;

    bunny.scale.x = scale;
    bunny.scale.y = scale;
    
    p1.setPosition({x: 370, y: 380});
    p1.setScale({x: scale, y:scale});

    // Add the bunny to the scene we are building.
    stage.addChild(bunny);
    stage.addChild(p1.getSprite());

    // kick off the animation loop (defined below)
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

var fpsWorker = new Worker('fps.js');

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);
    
	//console.log(ticker.FPS);
    fpsWorker.postMessage(ticker.FPS);
    
    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}
