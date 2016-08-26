define([
    'Entities/Background',
    'Entities/Platform',
    'Entities/Player',
    'Entities/BlockCoin',
    'Entities/PositionField',
    'Entities/MovingPlatform'
], 
function(
    Background,
    Platform,
    Player,
    BlockCoin,
    PositionField,
    MovingPlatform
){
    
    var Entities = {
        Background: Background,
        Platform : Platform,
        Player : Player,
        BlockCoin : BlockCoin,
        PositionField : PositionField,
        MovingPlatform : MovingPlatform
    };
    
    return Entities;
    
});