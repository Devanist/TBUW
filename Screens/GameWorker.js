var world = null;
var CAMERA_OFFSET = 250;
var elementsQuantity = null;
var PLAYER = null;
var oldPlayerPos = {};
var x = 0, y = 0, ex = 0, ey = 0, temp = null;
var collisionOccured = false;

self.onmessage = function(e){
    
    world = JSON.parse(e.data);
    
    elementsQuantity = world.ELEMENTS.length;
    
    //Zapisanie referencji do playera i uaktualnienie pozycji końcowych spritów
    var temp = null;
    for(var i = 0; i < elementsQuantity; i+=1){
        temp = world.ELEMENTS[i];
        temp.size.w += temp.offset.width;
        temp.size.h += temp.offset.height;
        temp.currentRotationAngle += temp.rotation;
        if(temp.type === "player"){
            PLAYER = temp;
        }
        temp.position.endX = temp.position.x + temp.size.w;
        temp.position.endY = temp.position.y + temp.size.h;
    }

    oldPlayerPos = {
        x: PLAYER.position.x,
        y: PLAYER.position.y, 
        ex: PLAYER.position.endX,
        ey: PLAYER.position.endY
    };
    
    //Obsłuż input usera
    if(world.KEYS_STATE.ARROW_RIGHT || world.KEYS_STATE.D || world.VCONTROLLER.AXIS_X > 30){
        PLAYER.velocity.x += 7;
        if(PLAYER.direction == -1){
            PLAYER.direction = 1;
        }
    }
    if(world.KEYS_STATE.ARROW_LEFT || world.KEYS_STATE.A || world.VCONTROLLER.AXIS_X < -30){
        PLAYER.velocity.x -= 7;
        if(PLAYER.direction == 1){
            PLAYER.direction = -1;

        }
    }
    if(world.KEYS_STATE.ARROW_UP || world.KEYS_STATE.W || world.VCONTROLLER.BUTTON_A){
        if(PLAYER.state.inAir === false){
            PLAYER.velocity.y -= 15;
        }
    }
    if(world.KEYS_STATE.ARROW_DOWN || world.KEYS_STATE.S){
        //PLAYER.velocity.y += 7;
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
        temp = world.ELEMENTS[i];
        if(temp.type !== "background" && temp.type !== "player"){
            if( !(x > temp.position.endX || ex < temp.position.x || 
                y > temp.position.endY || ey < temp.position.y)){
                
                if(temp.type === "BlockCoin"){
                    console.log(temp.type);
                    continue;
                }
                
                collisionOccured = true;
                
                //Jeżeli player jest powyzej obiektu z którym nastąpiła kolizja
                if(y < temp.position.y && temp.position.endY >= ey && oldPlayerPos.ey <= temp.position.y){
                    if(temp.type === "platform"){
                        PLAYER.state.inAir = false;
                        PLAYER.velocity.y = 0;
                        PLAYER.position.y = temp.position.y - PLAYER.size.h - 1;
                    }
                }
                
                //Jeżeli player jest pod obiektem
                else if(y >= temp.position.y && temp.position.endY <= ey && oldPlayerPos.y >= temp.position.endY){
                    if(temp.type === "platform"){
                        PLAYER.velocity.y = 0;
                        PLAYER.position.y = temp.position.endY + 1;
                    }
                }
                
                //Jeżeli player jest na lewo od obiektu
                else if(ex >= temp.position.x && x <= temp.position.x){
                    if(temp.type === "platform"){
                        PLAYER.velocity.x = 0;
                        PLAYER.position.x = temp.position.x - PLAYER.size.w;
                    }
                }
                
                //Jeżeli gracz jest na prawo od obiektu
                else if(x <= temp.position.endX && temp.position.endX <= ex){
                    if(temp.type === "platform"){
                        PLAYER.velocity.x = 0;
                        PLAYER.position.x = temp.position.endX + 1;
                    }
                }
                
                //Uaktualnienie pozycji końcowego x i y
                PLAYER.position.endY = PLAYER.position.y + PLAYER.size.h;
                PLAYER.position.endX = PLAYER.position.x + PLAYER.size.w;
            }
        }
    }
    //Obsłuż, jeśli nie wystąpiła kolizja
    if(collisionOccured === false){
        PLAYER.state.inAir = true;
    }
    
    //W razie potrzeby nanieś poprawkę na pozycję playera
    if(PLAYER.position.x < 0){
        PLAYER.position.x = 0;
    }
    
    //PARALLAX
    if(PLAYER.position.x > CAMERA_OFFSET){
        
        for(var i = 0; i < elementsQuantity; i+=1){
            temp = world.ELEMENTS[i];
            if(temp.type === "background"){
                temp.position.x += (PLAYER.position.x - oldPlayerPos.x) * temp.movingSpeedFactor;
            }
        }
        
    }
    
    //Przemieść kamerę
    world.CONTAINER.x = -PLAYER.position.x + CAMERA_OFFSET;
    if(world.CONTAINER.x >= 0){
        world.CONTAINER.x = 0;
    }
    
    //Uaktualnij prędkość playera
    PLAYER.velocity.x = -(PLAYER.velocity.x * world.AIR_RES);
    PLAYER.velocity.y +=  world.GRAVITY;
    
    //GUI
    var l = world.GUI_ELEMENTS.length;
    for(var i = 0; i < l; i+=1){
        temp = world.GUI_ELEMENTS[i];
        temp.currentRotationAngle += temp.rotation;
    }
    
    postMessage(JSON.stringify(world));
    
};