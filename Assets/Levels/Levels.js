define([
    "json!Assets/Levels/c1_l1.json",
    "json!Assets/Levels/c1_l2.json",
    "json!Assets/Levels/test.json"
], 
function(c1_l1, c1_l2, test){

    var Levels = {
        C1_L1: c1_l1,
        C1_L2: c1_l2,
        test: test
    };

    return Levels;

});