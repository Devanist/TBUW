var world = null;
var CAMERA_OFFSET = 250;
var elementsQuantity = null;
var PLAYER = null;
var oldPlayerPos = null;
var x = 0, y = 0, ex = 0, ey = 0, temp = null;
var collisionOccured = false;
var temp = null;
var conditionsMet = 0;

self.onmessage = function(e){
    
    world = JSON.parse(e.data);
    world.REMOVE_LIST = [];
    
    elementsQuantity = world.ELEMENTS.length;
    
    //Zapisanie referencji do playera i uaktualnienie pozycji końcowych spritów
    for(var i = 0; i < elementsQuantity; i+=1){
        temp = world.ELEMENTS[i];
        temp.size.w += temp.offset.width;
        temp.size.h += temp.offset.height;
        temp.currentRotationAngle += temp.rotation;
        if(temp.type === "Player"){
            PLAYER = temp;
        }
        if(temp.toBeRemoved){
            world.REMOVE_LIST.push(temp.id);
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
        PLAYER.velocity.x += 9 / world.SMALL;
        PLAYER.state.moving += 1;
        if(PLAYER.direction == -1){
            PLAYER.direction = 1;
        }
    }
    if(world.KEYS_STATE.ARROW_LEFT || world.KEYS_STATE.A || world.VCONTROLLER.AXIS_X < -30){
        PLAYER.velocity.x -= 9 / world.SMALL;
        PLAYER.state.moving += 1;
        if(PLAYER.direction == 1){
            PLAYER.direction = -1;
        }
    }
    if(world.KEYS_STATE.ARROW_UP || world.KEYS_STATE.W || world.VCONTROLLER.BUTTON_A){
        if(PLAYER.state.inAir === false){
            PLAYER.velocity.y -= 16 / world.SMALL;
            world.SOUNDS.push("jump");
        }
        else if(PLAYER.state.doubleJumped === false && PLAYER.state.canDoubleJump === true){
            PLAYER.state.doubleJumped = true;
            PLAYER.velocity.y -= 14 / world.SMALL;
            world.SOUNDS.push("jump");
        }
    }
    if(world.KEYS_STATE.ARROW_DOWN || world.KEYS_STATE.S){
    }
    
    if(PLAYER.state.inAir === true && PLAYER.velocity.y > -4 / world.SMALL && world.KEYS_STATE.ARROW_UP === false){
        PLAYER.state.canDoubleJump = true;
    }
    else{
        PLAYER.state.canDoubleJump = false;
    }
    
    if(PLAYER.velocity.x === 0){        
        PLAYER.state.moving = 0;
    }
    if(PLAYER.state.moving == 50){
        PLAYER.state.moving = 0;
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
    var tx, tex, ty, tey;
    for(i = 0; i < elementsQuantity; i += 1){
        temp = world.ELEMENTS[i];
        if(temp.type !== "Background" && temp.type !== "Player"){
            
            if(temp.anchor !== undefined){
                tx = temp.position.x - temp.anchor.x * temp.size.w;
                tex = tx + temp.size.w;
                ty = temp.position.y - temp.anchor.y * temp.size.h;
                tey = ty + temp.size.h;
            }
            else{
                tx = temp.position.x;
                tex = temp.position.endX;
                ty = temp.position.y;
                tey = temp.position.endY;
            }
            
            if( !(x > tex || ex < tx || y > tey || ey < ty)){
                
                if(temp.type === "BlockCoin"){
                    world.REMOVE_LIST.push(temp.id);
                    continue;
                }
                
                collisionOccured = true;
                
                //Jeżeli player jest powyzej obiektu z którym nastąpiła kolizja
                if(y < ty && tey >= ey && oldPlayerPos.ey <= ty){
                    if(temp.type === "Platform"){
                        PLAYER.state.inAir = false;
                        PLAYER.state.doubleJumped = false;
                        PLAYER.velocity.y = 0;
                        PLAYER.position.y = ty - PLAYER.size.h;
                    }
                }
                
                //Jeżeli player jest pod obiektem
                else if(y >= ty && tey <= ey && oldPlayerPos.y >= tey){
                    if(temp.type === "Platform"){
                        PLAYER.velocity.y = 0;
                        PLAYER.position.y = tey;
                    }
                }
                
                //Jeżeli player jest na lewo od obiektu
                else if(ex >= tx && x <= tx){
                    if(temp.type === "Platform"){
                        PLAYER.velocity.x = 0;
                        PLAYER.position.x = tx - PLAYER.size.w + 1;
                    }
                }
                
                //Jeżeli gracz jest na prawo od obiektu
                else if(x <= tex && tex <= ex){
                    if(temp.type === "Platform"){
                        PLAYER.velocity.x = 0;
                        PLAYER.position.x = temp.position.endX;
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
        
        for(i = 0; i < elementsQuantity; i+=1){
            temp = world.ELEMENTS[i];
            if(temp.type === "Background"){
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
    
    if(PLAYER.velocity.x < 1 && PLAYER.velocity.x > -1){
        PLAYER.velocity.x = 0;
    }
    
    //GUI
    var l = world.GUI_ELEMENTS.length;
    for(i = 0; i < l; i+=1){
        temp = world.GUI_ELEMENTS[i];
        temp.currentRotationAngle += temp.rotation;
    }
    
    l = world.WIN_CONDITIONS.length;
    conditionsMet = 0;
    for(i = 0; i < l; i+=1){
        temp = world.WIN_CONDITIONS[i];
        if(temp.name === "Blockcoin" && world.PLAYER_CURRENCIES.blockcoin >= temp.value){
            conditionsMet++;
        }
    }
    if(conditionsMet === l){
        world.WON = true;
    }
    
    postMessage(JSON.stringify(world));
    
};