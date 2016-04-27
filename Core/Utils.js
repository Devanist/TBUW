define([
    'Core/Utils/isTouchDevice',
    'Core/Utils/copy'
], function(isTouchDevice, copy){
    
    var Utils = {
        isTouchDevice: isTouchDevice,
        copy: copy
    };
    
    return Utils;
    
});