define(['./Item'], function(Item){
    
    var Platform = function(sprite){
        Item.call(this, sprite);
        this._isStatic = true;
        this._speedVector.y = 0;
    };

    Platform.prototype = Object.create(Item.prototype, {
        constructor: {
            value: Platform,
            writable: true,
            enumerable: false,
            configurable: true
        }
    });

    var _p = Platform.prototype;

    return Platform;
    
});