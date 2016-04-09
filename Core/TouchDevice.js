define([
    
], function(){
    
    var TouchDevice = function(){
        this._onGoingTouches = [];
        
    };
    
    TouchDevice.prototype = {
        
        handleTouchStart : function(e){
            e.preventDefault();
            //console.log('touch' + e.changedTouches[0].identifier + 'start!');
            var touches = e.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                this._onGoingTouches.push(this.copyTouch(touches[i]));
            }
        },
        
        handleTouchEnd : function(e){
            console.log('touch end!');
        },
        
        handleTouchCancel : function(e){
            e.preventDefault();
            console.log('canceling touch');
            var touches = evt.changedTouches;
  
            for (var i = 0; i < touches.length; i++) {
                ongoingTouches.splice(i, 1);  // remove it; we're done
            }
        },
        
        handleTouchMove : function(e){
            e.preventDefault();
            console.log('moving touch');
            var touches = e.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                var idx = this.ongoingTouchIndexById(touches[i].identifier);
                if (idx >= 0) {
                    console.log("continuing touch "+idx);
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
            return -1;    // not found
        }
        
    };
    
    return TouchDevice;
    
});