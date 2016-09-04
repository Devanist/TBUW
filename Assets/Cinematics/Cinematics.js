define([
    "json!Assets/Cinematics/intro.json",
    "json!Assets/Cinematics/c1_c2.json"
],
function(intro, c1_c2){
    
    var Cinematics = {
        intro: intro,
        c1_c2: c1_c2
    };
    
    return Cinematics;
    
});