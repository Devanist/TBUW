self.onmessage = function(e){
    
    var world = JSON.parse(e.data);
    
    var PLAYER = null;
    
    for(var i = 0; i < world.ELEMENTS.length; i+=1){
        if(world.ELEMENTS[i].type === "player"){
            PLAYER = world.ELEMENTS[i];
        }
    }
    
    //Obsłuż input usera
    if(world.KEYS_STATE.ARROW_RIGHT || world.KEYS_STATE.D){
        PLAYER.velocity.x += 5;
    }
    if(world.KEYS_STATE.ARROW_LEFT || world.KEYS_STATE.A){
        PLAYER.velocity.x -= 5;
    }
    if(world.KEYS_STATE.ARROW_UP || world.KEYS_STATE.W){
        PLAYER.velocity.y -= 5;
    }
    if(world.KEYS_STATE.ARROW_DOWN || world.KEYS_STATE.S){
        PLAYER.velocity.y += 5;
    }
    
    //Uaktualnij pozycję playera
    PLAYER.position.x += PLAYER.velocity.x;
    PLAYER.position.y += PLAYER.velocity.y;
    
    //W razie potrzeby nanieś poprawkę na pozycję playera
    if(PLAYER.position.x < 0){
        PLAYER.position.x = 0;
    }
    
    //Uaktualnij prędkość playera
    PLAYER.velocity.x = -(PLAYER.velocity.x * world.AIR_RES);
    PLAYER.velocity.y = -(PLAYER.velocity.y * world.GRAVITY);
    
    postMessage(JSON.stringify(world));
    
};