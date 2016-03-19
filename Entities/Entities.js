define([
    './Background',
    './Platform',
    './Player'
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