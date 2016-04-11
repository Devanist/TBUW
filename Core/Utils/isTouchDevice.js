define([], function(){
    
    isTouchDevice = function isTouchDevice() {
        var el = document.createElement('div');
        el.setAttribute('ontouchstart', 'return;');
        return typeof el.ontouchstart === "function";
    };
    
    return isTouchDevice;
    
});