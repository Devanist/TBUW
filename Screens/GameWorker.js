const COLLISION_TYPES = [
    "Platform",
    "MovingPlatform"
];
const CAMERA_OFFSET = 350;
const CAMERA_OFFSET_Y = 518;

function isDescendantOfObstacle (element) {
    return element.inheritedTypes && element.inheritedTypes.some((type) => type === "Obstacle");
}

self.onmessage = function (e) {
    const world = JSON.parse(e.data);
    world.REMOVE_LIST = [];
    let PLAYER;
    let playerCollisionOccured = false;
    let playerInFinalPosition = false;

    function updatePlayerPositionAndState () {
        PLAYER.state.canDoubleJump =
            PLAYER.state.inAir === true &&
            PLAYER.velocity.y > -4 / world.SMALL &&
            world.KEYS_STATE.ARROW_UP === false;

        if (PLAYER.velocity.x === 0) {
            PLAYER.state.moving = 0;
        }

        if (PLAYER.state.moving === 50) {
            PLAYER.state.moving = 0;
        }

        PLAYER.position.x += Math.floor(PLAYER.velocity.x);
        PLAYER.position.y += Math.floor(PLAYER.velocity.y);
        PLAYER.position.endX += Math.floor(PLAYER.velocity.x);
        PLAYER.position.endY += Math.floor(PLAYER.velocity.y);
    }

    function fixPlayerPositionAndVelocity () {
        const { position, size: { width }, velocity } = PLAYER;
        if (position.x < 0) {
            position.x = 0;
        }
        else if (position.endX > world.LEVEL_END_X) {
            position.x = world.LEVEL_END_X - width - 1;
        }
        velocity.x = Math.floor(-(velocity.x * world.AIR_RES));
        velocity.y += world.GRAVITY;

        PLAYER.position.endY = PLAYER.position.y + PLAYER.size.height;
        PLAYER.position.endX = PLAYER.position.x + PLAYER.size.width;
    }

    function moveCameraWithPlayer () {
        world.CONTAINER.x = -PLAYER.position.x + CAMERA_OFFSET / world.SMALL;
    }

    function fixCameraPosition () {
        const cameraWentRightSide = world.CONTAINER.x >= 0;
        const cameraWentLeftSideTillEndOfLevel = world.CONTAINER.x - (world.WINDOW_WIDTH - CAMERA_OFFSET) <= -world.LEVEL_END_X;
        const playerHasFallen = PLAYER.position.y < 1100;

        if (cameraWentRightSide) {
            world.CONTAINER.x = 0;
        }
        else if (cameraWentLeftSideTillEndOfLevel) {
            world.CONTAINER.x = -(world.LEVEL_END_X - (world.WINDOW_WIDTH - CAMERA_OFFSET));
        }

        if (playerHasFallen) {
            world.CONTAINER.y = -PLAYER.position.y + CAMERA_OFFSET_Y / world.SMALL;
            world.LOSE = true;
        }
    }

    function updateCameraPosition () {
        moveCameraWithPlayer();
        fixCameraPosition();
    }

    function handleUserInput () {
        const MIN_V_CONTROLLER_INCLINATION = 30;
        const { KEYS_STATE } = world;

        if (KEYS_STATE.ARROW_RIGHT || KEYS_STATE.D || world.VCONTROLLER.AXIS_X > MIN_V_CONTROLLER_INCLINATION) {
            PLAYER.velocity.x += 9 / world.SMALL;
            PLAYER.state.moving += 1;
            if (PLAYER.direction === -1) {
                PLAYER.direction = 1;
            }
        }
        if (KEYS_STATE.ARROW_LEFT || KEYS_STATE.A || world.VCONTROLLER.AXIS_X < -MIN_V_CONTROLLER_INCLINATION) {
            PLAYER.velocity.x -= 9 / world.SMALL;
            PLAYER.state.moving += 1;
            if (PLAYER.direction === 1) {
                PLAYER.direction = -1;
            }
        }
        if (KEYS_STATE.ARROW_UP || KEYS_STATE.W || world.VCONTROLLER.BUTTON_A) {
            if (PLAYER.state.inAir === false) {
                PLAYER.state.inAir = true;
                PLAYER.velocity.y -= 16 / world.SMALL;
                world.SOUNDS.push({name: "jump"});
            }
            else if (PLAYER.state.doubleJumped === false && PLAYER.state.canDoubleJump === true) {
                PLAYER.state.doubleJumped = true;
                PLAYER.velocity.y = -16 / world.SMALL;
                world.SOUNDS.push({name: "jump"});
            }
        }
    }

    function getCornerPoints (element) {
        if (element.anchor) {
            const tx = element.position.x - element.anchor.x * element.size.width;
            const ty = element.position.y - element.anchor.y * element.size.height;
            return {
                tx,
                tex: tx + element.size.width,
                ty,
                tey: ty + element.size.height,
            }
        }

        return {
            tx: element.position.x,
            tex: element.position.endX,
            ty: element.position.y,
            tey: element.position.endY,
        };
    }

    function checkIfWinConditionsAreMet () {
        let conditionsMet = 0;

        world.WIN_CONDITIONS.forEach((condition) => {
            if (condition.name === "BlockCoin" && world.PLAYER_CURRENCIES.BlockCoin >= condition.value) {
                conditionsMet++;
            }
            else if (condition.name === "position") {
                if ( PLAYER.position.x >= condition.value.lux / world.SMALL &&
                    PLAYER.position.x <= condition.value.rdx / world.SMALL &&
                    PLAYER.position.y >= condition.value.luy / world.SMALL &&
                    PLAYER.position.y <= condition.value.rdy / world.SMALL
                ) {
                    if (playerInFinalPosition === false) {
                        playerInFinalPosition = true;
                        conditionsMet++;
                    }
                }
                else {
                    if (playerInFinalPosition === true) {
                        playerInFinalPosition = false;
                        conditionsMet--;
                    }
                }
            }
        });

        return conditionsMet === world.WIN_CONDITIONS.length;
    }

    function checkForPlayerCollision () {
        const { position: playerPosition} = PLAYER;
        world.ELEMENTS.forEach((element) => {
            if (isCollisionType(element)) {
                const { tx, tex, ty, tey } = getCornerPoints(element);

                if (isDescendantOfObstacle(element)) {
                    element.state.collisionItems.forEach((collisionItem) => {
                        if ( !(
                            playerPosition.x + 10 > collisionItem.currentPosition.ex + tx ||
                            playerPosition.endX - 10 < collisionItem.currentPosition.x + tx ||
                            playerPosition.y + 10 > collisionItem.currentPosition.ey + ty ||
                            playerPosition.endY - 10 < collisionItem.currentPosition.y + ty
                        )) {
                            world.LOSE = true;
                        }
                    });
                }

                if ( ! (playerPosition.x > tex || playerPosition.endX < tx || playerPosition.y > tey || playerPosition.endY < ty) ) {
                    if (element.type === "BlockCoin") {
                        world.REMOVE_LIST.push(element.id);
                        return;
                    }

                    playerCollisionOccured = true;

                    const playerAboveCollidingEntity = playerPosition.y < ty && tey >= playerPosition.endY && oldPlayerPosition.ey <= ty && (playerPosition.endX - 10 > tx || playerPosition.x + 10 < tex);
                    const playerUnderCollidingEntity = playerPosition.y >= ty && tey <= playerPosition.endY && oldPlayerPosition.y >= tey;
                    const playerLeftToCollidingEntity = playerPosition.endX >= tx && playerPosition.x <= tx;
                    const playerRightToCollidingEntity = playerPosition.x <= tex && tex <= playerPosition.endX;

                    if (playerAboveCollidingEntity) {
                        PLAYER.state.inAir = false;
                        PLAYER.state.doubleJumped = false;
                        PLAYER.velocity.y = 0;
                        PLAYER.position.y = ty - PLAYER.size.height;
                        if (element.type === "MovingPlatform") {
                            PLAYER.position.x += element.moveBy.x;
                            PLAYER.position.y += element.moveBy.y;
                        }
                    }
                    else if (playerUnderCollidingEntity) {
                        PLAYER.velocity.y = 1;
                        PLAYER.position.y = tey + 1;
                    }
                    else if (playerLeftToCollidingEntity) {
                        PLAYER.velocity.x = 0;
                        PLAYER.position.x = tx - (PLAYER.size.width + 1);
                    }
                    else if (playerRightToCollidingEntity) {
                        PLAYER.velocity.x = 0;
                        PLAYER.position.x = element.position.endX + 1;
                    }
                }
            }
        });
    }

    function moveBackgroundElementsWithParallaxEffect () {
        if (PLAYER.position.x > CAMERA_OFFSET) {
            world.ELEMENTS.forEach((element) => {
                if (element.type === "Background") {
                    element.position.x += ((PLAYER.position.x - oldPlayerPosition.x) * element.movingSpeedFactor) | 0;
                }
            });
        }
    }

    //Zapisanie referencji do playera i uaktualnienie pozycji końcowych spritów
    world.ELEMENTS.forEach((element) => {
        if (element.toBeRemoved) {
            world.REMOVE_LIST.push(element.id);
            return;
        }

        const { animationSpeed, position, size } = element;

        size.width += element.offset.width;
        size.height += element.offset.height;
        element.currentRotationAngle += element.rotation;

        if (element.type === "Player") {
            PLAYER = element;
        }
        else if (isDescendantOfObstacle(element)) {
            element.state.collisionItems.forEach((item) => {
                item.currentPosition.y += animationSpeed;
                item.currentPosition.ey += animationSpeed;
                if (item.currentPosition.y < item.initialPosition.y - element.maxHeight) {
                    item.currentPosition = JSON.parse(JSON.stringify(item.initialPosition));
                }
            });
        }

        position.endX = position.x + size.width;
        position.endY = position.y + size.height;
    });

    const oldPlayerPosition = {
        x: PLAYER.position.x,
        y: PLAYER.position.y,
        ex: PLAYER.position.endX,
        ey: PLAYER.position.endY
    };

    handleUserInput();
    updatePlayerPositionAndState();

    playerCollisionOccured = checkForPlayerCollision();
    if (!playerCollisionOccured) PLAYER.state.inAir = true;

    fixPlayerPositionAndVelocity()
    moveBackgroundElementsWithParallaxEffect();
    updateCameraPosition();
    world.WON = checkIfWinConditionsAreMet()

    postMessage(JSON.stringify(world));
};

/**
 * Checks if given type takes part in collisions check.
 * @param {String} type
 * @returns {Boolean}
 */
function isCollisionType (type) {
    return COLLISION_TYPES.some((collisionType) => type === collisionType);
}

/**
 * @param {Object} obj1
 * @param {Object} obj2
 */
function isCollisionWithRotatingObject (obj1, obj2) {
    const anchorPoint = calculateAnchorPoint(obj2);
    const rotatedPoints = rotateRectangle(obj2, anchorPoint, obj2.currentRotationAngle);

    for (const point in rotatedPoints) {
        if (rotatedPoints.hasOwnProperty(point)) {
            if ( point.x > obj1.position.x && point.x < obj1.position.endX &&
                point.y > obj1.position.y && point.y < obj1.position.endY) {
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
function calculateAnchorPoint (obj) {
    const anchorPoint = {
        x: obj.position.x,
        y: obj.position.y
    };

    if (obj.anchor) {
        anchorPoint.x += obj.size.width * obj.anchor.x;
        anchorPoint.y += obj.size.height * obj.anchor.y;
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
function rotateRectangle (obj, anchor, angle) {
    //  A=======B
    //  |       |
    //  D=======C
    const points = {
        A: {x: obj.position.x, y: obj.position.y},
        B: {x: obj.position.endX, y: obj.position.y},
        C: {x: obj.position.endX, y: obj.position.endY},
        D: {x: obj.position.x, y: obj.position.endY}
    };

    points.forEach((point) => {
        points[point] = rotatePoint(points[point], anchor, angle);
    })
    return points;
}

function rotatePoint (point, anchor, angle) {
    return {
        x: (point.x - anchor.x) * Math.cos(angle) + (point.y - anchor.y) * Math.sin(angle) + anchor.x,
        y: -((point.x - anchor.x) * Math.sin(angle) - (point.y - anchor.y) * Math.cos(angle) - anchor.y)
    };
}
