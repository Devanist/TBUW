define(['./Entity'], function(Entity){
    
    var Background = function(sprite){
        Entity.call(this, sprite);
    };
    
    Background.prototype = Object.create(Entity.prototype, {
        constructor: {
            value: Background,
            writable: true,
            configurable: true,
            enumerable: false
        }
    });
    
    return Background;
    
});