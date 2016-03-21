define([
    'Entities/Background',
    'Entities/Platform',
    'Entities/Player'
], 
function(
    Background,
    Platform,
    Player
){
    
    var Entities = {
        Background: Background,
        Platform : Platform,
        Player : Player
    };
    
    return Entities;
    
});