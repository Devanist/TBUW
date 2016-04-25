define([
    'Entities/Background',
    'Entities/Platform',
    'Entities/Player',
    'Entities/BlockCoin'
], 
function(
    Background,
    Platform,
    Player,
    BlockCoin
){
    
    var Entities = {
        Background: Background,
        Platform : Platform,
        Player : Player,
        BlockCoin : BlockCoin
    };
    
    return Entities;
    
});