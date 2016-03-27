self.onmessage = function(e){
    
    var world = JSON.parse(e.data);
    
    //Obsłuż input usera
    if(world.KEYS_STATE.ARROW_RIGHT || world.KEYS_STATE.D){
        world.PLAYER.velocity.x += 5;
    }
    if(world.KEYS_STATE.ARROW_LEFT || world.KEYS_STATE.A){
        world.PLAYER.velocity.x -= 5;
    }
    if(world.KEYS_STATE.ARROW_UP || world.KEYS_STATE.W){
        world.PLAYER.velocity.y -= 5;
    }
    if(world.KEYS_STATE.ARROW_DOWN || world.KEYS_STATE.S){
        world.PLAYER.velocity.y += 5;
    }
    
    //Uaktualnij pozycję playera
    world.PLAYER.position.x += world.PLAYER.velocity.x;
    console.log(world.PLAYER.position.x + ' + ' + world.PLAYER.velocity.x);
    world.PLAYER.position.y += world.PLAYER.velocity.y;
    
    //Uaktualnij prędkość playera
    world.PLAYER.velocity.x = -(world.PLAYER.velocity.x * world.AIR_RES);
    world.PLAYER.velocity.y = -(world.PLAYER.velocity.y * world.GRAVITY);
    
    postMessage(JSON.stringify(world));
    
};