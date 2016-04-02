var world = null;
var PLAYER_START_POS_X = 60;
var elementsQuantity = null;
var PLAYER = null;
var oldPlayerPos = {};
var x = 0, y = 0, ex = 0, ey = 0, temp = null;
var collisionOccured = false;

self.onmessage = function(e){
    
    world = JSON.parse(e.data);
    
    if(elementsQuantity === null){
        elementsQuantity = world.ELEMENTS.length;
    }
    
    //Zapisanie referencji do playera i uaktualnienie pozycji końcowych spritów
    for(var i = 0; i < elementsQuantity; i+=1){
        if(world.ELEMENTS[i].type === "player"){
            PLAYER = world.ELEMENTS[i];
        }
        world.ELEMENTS[i].position.endX = world.ELEMENTS[i].position.x + world.ELEMENTS[i].size.w;
        world.ELEMENTS[i].position.endY = world.ELEMENTS[i].position.y + world.ELEMENTS[i].size.h;
    }
    
    oldPlayerPos = {
        x: PLAYER.position.x,
        y: PLAYER.position.y 
    };
    
    //Obsłuż input usera
    if(world.KEYS_STATE.ARROW_RIGHT || world.KEYS_STATE.D){
        PLAYER.velocity.x += 7;
    }
    if(world.KEYS_STATE.ARROW_LEFT || world.KEYS_STATE.A){
        PLAYER.velocity.x -= 7;
    }
    if(world.KEYS_STATE.ARROW_UP || world.KEYS_STATE.W){
        if(PLAYER.state.inAir === false){
            PLAYER.velocity.y -= 15;
            console.log('up');
        }
    }
    if(world.KEYS_STATE.ARROW_DOWN || world.KEYS_STATE.S){
        PLAYER.velocity.y += 7;
    }
    
    //Uaktualnij pozycję playera
    PLAYER.position.x += PLAYER.velocity.x;
    PLAYER.position.y += PLAYER.velocity.y;
    PLAYER.position.endX += PLAYER.velocity.x;
    PLAYER.position.endY += PLAYER.velocity.y;
    
    //Wykryj kolizje
    x = PLAYER.position.x;
    ex = PLAYER.position.endX;
    y = PLAYER.position.y;
    ey = PLAYER.position.endY;
    collisionOccured = false;
    for(var i = 0; i < elementsQuantity; i += 1){
        if(world.ELEMENTS[i].type !== "background" && world.ELEMENTS[i].type !== "player"){
            temp = world.ELEMENTS[i].position;
            if( !(x > temp.endX || ex < temp.x || 
                y > temp.endY || ey < temp.y)){
                
                collisionOccured = true;
                
                //czy player jest powyzej
                if(y <= temp.y && temp.endY >= ey){
                    PLAYER.state.inAir = false;
                    PLAYER.velocity.y = 0;
                    PLAYER.position.y = temp.y - PLAYER.size.h;
                    PLAYER.position.endY = PLAYER.position.y + PLAYER.size.h + 1;
                }
                
            }
        }
    }
    if(collisionOccured === false){
        PLAYER.state.inAir = true;
    }
    
    //W razie potrzeby nanieś poprawkę na pozycję playera
    if(PLAYER.position.x < 0){
        PLAYER.position.x = 0;
    }
    
    //PARALLAX
    if(PLAYER.position.x > PLAYER_START_POS_X){
        
        for(var i = 0; i < elementsQuantity; i+=1){
            if(world.ELEMENTS[i].type === "background"){
                world.ELEMENTS[i].position.x += (PLAYER.position.x - oldPlayerPos.x) * world.ELEMENTS[i].movingSpeedFactor;
            }
        }
        
    }
    
    //Przemieść kamerę
    world.CONTAINER.x = -PLAYER.position.x + PLAYER_START_POS_X;
    if(world.CONTAINER.x >= 0){
        world.CONTAINER.x = 0;
    }
    
    //Uaktualnij prędkość playera
    PLAYER.velocity.x = -(PLAYER.velocity.x * world.AIR_RES);
    PLAYER.velocity.y +=  world.GRAVITY;
    
    postMessage(JSON.stringify(world));
    
};