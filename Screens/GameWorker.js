var world = null;
var CAMERA_OFFSET = 250;
var CAMERA_OFFSET_Y = 518;
var elementsQuantity = null;
var PLAYER = null;
var oldPlayerPos = null;
var x = 0, y = 0, ex = 0, ey = 0, temp = null;
var collisionOccured = false;
var temp = null;
var conditionsMet = 0;
var playerInFinalPosition = false;

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
            PLAYER.state.inAir = true;
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
    PLAYER.position.x += PLAYER.velocity.x | 0;
    PLAYER.position.y += PLAYER.velocity.y | 0;
    PLAYER.position.endX += PLAYER.velocity.x | 0;
    PLAYER.position.endY += PLAYER.velocity.y | 0;
    
    //Wykryj kolizje
    x = PLAYER.position.x;
    ex = PLAYER.position.endX;
    y = PLAYER.position.y;
    ey = PLAYER.position.endY;
    collisionOccured = false;
    var tx, tex, ty, tey;
    for(let i = 0; i < elementsQuantity; i += 1){
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
            
            if( !(x > tex || ex < tx || y > tey || ey < ty) ){
                
                if(temp.type === "BlockCoin"){
                    world.REMOVE_LIST.push(temp.id);
                    continue;
                }
                
                collisionOccured = true;
                
                //Jeżeli player jest powyzej obiektu z którym nastąpiła kolizja
                if( y < ty && tey >= ey && oldPlayerPos.ey <= ty &&
                    (ex - 10 > tx || x + 10 < tex)){
                    if(isCollisionType(temp.type)){
                        PLAYER.state.inAir = false;
                        PLAYER.state.doubleJumped = false;
                        PLAYER.velocity.y = 0;
                        PLAYER.position.y = ty - PLAYER.size.h;
                        if(temp.type === "MovingPlatform"){
                            PLAYER.position.x += temp.moveBy.x;
                            PLAYER.position.y += temp.moveBy.y;
                        }
                    }
                }
                
                //Jeżeli player jest pod obiektem
                else if(y >= ty && tey <= ey && oldPlayerPos.y >= tey){
                    if(isCollisionType(temp.type)){
                        PLAYER.velocity.y = 1;
                        PLAYER.position.y = tey + 1;
                    }
                }
                
                //Jeżeli player jest na lewo od obiektu
                else if(ex >= tx && x <= tx){
                    if(isCollisionType(temp.type)){
                        console.log('collision from left');
                        PLAYER.velocity.x = 0;
                        PLAYER.position.x = tx - (PLAYER.size.w + 1);
                    }
                }
                
                //Jeżeli gracz jest na prawo od obiektu
                else if(x <= tex && tex <= ex){
                    if(isCollisionType(temp.type)){
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
        
        for(i = 0; i < elementsQuantity; i+=1){
            temp = world.ELEMENTS[i];
            if(temp.type === "Background"){
                temp.position.x += ((PLAYER.position.x - oldPlayerPos.x) * temp.movingSpeedFactor) | 0;
            }
        }
        
    }
    
    //Przemieść kamerę
    world.CONTAINER.x = -PLAYER.position.x + CAMERA_OFFSET;
    if(world.CONTAINER.x >= 0){
        world.CONTAINER.x = 0;
    }
    else if(world.CONTAINER.x - world.WINDOW_WIDTH <= -world.LEVEL_END_X){
        world.CONTAINER.x = -(world.LEVEL_END_X - world.WINDOW_WIDTH);
    }
    if(PLAYER.position.y < 1100){
        world.CONTAINER.y = -PLAYER.position.y + CAMERA_OFFSET_Y;
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
        if(temp.name === "BlockCoin" && world.PLAYER_CURRENCIES.BlockCoin >= temp.value){
            conditionsMet++;
        }
        else if(temp.name === "position"){
            if(PLAYER.position.x >= temp.value.lu.x && 
                PLAYER.position.x <= temp.value.rd.x &&
                PLAYER.position.y >= temp.value.lu.y &&
                PLAYER.position.y <= temp.value.rd.y){
                    if(playerInFinalPosition === false){
                        playerInFinalPosition = true;
                        conditionsMet++;
                    }
                }   
            else{
                if(playerInFinalPosition === true){
                    playerInFinalPosition = false;
                    conditionsMet--;
                }
            }
        }
    }
    if(conditionsMet === l){
        world.WON = true;
    }
    
    postMessage(JSON.stringify(world));
    
};

function isCollisionType(type){

    var collisionTypes = ["Platform", "MovingPlatform"];

    return collisionTypes.indexOf(type) >= 0;

}

function isCollisionWithRotatingObject(obj1, obj2){
    
    var anchorPoint = calculateAnchorPoint(obj2);

    var rotatedPoints = rotateRectangle(obj2, anchorPoint);

    for(let point in rotatedPoints){
        if(rotatedPoints.hasOwnProperty(point)){
            if( point.x > obj1.position.x && point.x < obj1.position.endX &&
                point.y > obj1.position.y && point.y < obj1.position.endY){
                return true;
            }
        }
    }

    return false;

}

/**
 * Returns anchor point of given object.
 * @param {obj} Given object 
 * @returns {object}
 */
function calculateAnchorPoint(obj){
    var anchorPoint = {
        x: obj.position.x,
        y: obj.position.y
    };

    if(obj.anchor !== undefined && obj.anchor !== null){
        anchorPoint.x += obj.size.w * obj.anchor.x;
        anchorPoint.y += obj.size.h * obj.anchor.y;
    }

    return anchorPoint;
}

/**
 * Returns set of points of rotated rectangle.
 * @param {object} Rectangle to rotate
 * @param {object} Anchor point of rectangle
 * @param {number} Angle of rotation in radians
 * @returns {object}
 */
function rotateRectangle(obj, anchor, angle){
    //  A=======B
    //  |       |
    //  D=======C
    var points = {
        A: {x: obj.position.x, y: obj.position.y},
        B: {x: obj.position.endX, y: obj.position.y},
        C: {x: obj.position.endX, y: obj.position.endY},
        D: {x: obj.position.x, y: obj.position.endY}
    };

    for(let point in points){
        if(points.hasOwnProperty(point)){
            points[point] = rotatePoint(points[point], anchor, angle) | 0;
        }
    }

    return points;
}

function rotatePoint(point, anchor, angle){
    return {
        x: (point.x - anchor.x) * Math.cos(angle) + (point.y - anchor.y) * Math.sin(angle) + anchor.x,
        y: -((point.x - anchor.x) * Math.sin(angle) - (point.y - anchor.y) * Math.cos(angle) - anchor.y)
    };
}