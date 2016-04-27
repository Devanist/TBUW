define([
    
], function(){
    
    var TouchDevice = function(){
        this._onGoingTouches = [];
    };
    
    TouchDevice.prototype = {
        
        handleTouchStart : function(e){
            e.preventDefault();
            var touches = e.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                this._onGoingTouches.push(this.copyTouch(touches[i]));
            }
        },
        
        handleTouchEnd : function(e){
            e.preventDefault();
            var touches = e.changedTouches;
            for(var i = 0; i < touches.length; i++) {
                var idx = this.ongoingTouchIndexById(touches[i].identifier);
                this._onGoingTouches.splice(idx, 1);
            }
        },
        
        handleTouchCancel : function(e){
            e.preventDefault();
            var touches = evt.changedTouches;
  
            for (var i = 0; i < touches.length; i++) {
                ongoingTouches.splice(i, 1);
            }
        },
        
        handleTouchMove : function(e){
            e.preventDefault();
            var touches = e.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                var idx = this.ongoingTouchIndexById(touches[i].identifier);
                if (idx >= 0) {
                    this._onGoingTouches.splice(idx, 1, this.copyTouch(touches[i]));
                }
            }
        },
        
        copyTouch: function(touch) {
            return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
        },
        
        ongoingTouchIndexById: function(idToFind) {
            for (var i = 0; i < this._onGoingTouches.length; i++) {
                var id = this._onGoingTouches[i].identifier;
                
                if (id == idToFind) {
                    return i;
                }
            }
            return -1;
        },
        
        getTouches : function(){
            return this._onGoingTouches;
        }
        
    };
    
    return TouchDevice;
    
});