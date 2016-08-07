define([
    "json!Assets/Levels/c1_l1.json",
    "json!Assets/Levels/test.json"
], 
function(c1_l1, test){

    var Levels = {
        C1_L1: c1_l1,
        test: test
    };

    return Levels;

});