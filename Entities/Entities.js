define([
    'Entities/Background',
    'Entities/Platform',
    'Entities/Player',
    'Entities/BlockCoin',
    'Entities/PositionField',
    'Entities/MovingPlatform',
    'Entities/LasersFromGround'
], 
function(
    Background,
    Platform,
    Player,
    BlockCoin,
    PositionField,
    MovingPlatform,
    LasersFromGround
){

    /**
     * @module Entities
     */
    var Entities = {
        Background: Background,
        Platform: Platform,
        Player: Player,
        BlockCoin: BlockCoin,
        PositionField: PositionField,
        MovingPlatform: MovingPlatform,
        LasersFromGround: LasersFromGround
    };
    
    return Entities;
    
});