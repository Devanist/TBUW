define([
    'Entities/Background',
    'Entities/Platform',
    'Entities/Player',
    'Entities/BlockCoin',
    'Entities/PositionField'
], 
function(
    Background,
    Platform,
    Player,
    BlockCoin,
    PositionField
){
    
    var Entities = {
        Background: Background,
        Platform : Platform,
        Player : Player,
        BlockCoin : BlockCoin,
        PositionField : PositionField
    };
    
    return Entities;
    
});