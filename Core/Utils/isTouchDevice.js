define([], function(){
    
    /**
     * Function returns true if current device can handle touch events.
     * @returns {boolean}
     */
    isTouchDevice = function isTouchDevice() {
        return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
    };
    
    return isTouchDevice;
    
});