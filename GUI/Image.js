define(['GUI/BaseElement'], function(Base){
    
    var Image = function(id, position, sprite){
        Base.call(this, id, position, sprite);
        this._data.type = "image";
    };
    
    Image.prototype = Object.create(Base.prototype, {
        constructor: {
            value: Image,
            enumerable: false,
            configurable: true,
            writable: true
        }
    });
    
    var _p = Image.prototype;
    
    return Image;
    
});