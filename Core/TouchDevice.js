define([
    
], function(){
    
    var TouchDevice = function(){
        this._onGoingTouches = [];
    };
    
    TouchDevice.prototype = {
        
        handleTouchStart : function(e){
            e.preventDefault();
            console.log(e);
            if (e.changedTouches === undefined) {
                this._onGoingTouches.push(this.copyTouch(e));
            }
            else {
                var touches = e.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    this._onGoingTouches.push(this.copyTouch(touches[i]));
                }
            }
            
        },
        
        handleTouchEnd : function(e){
            e.preventDefault();
            if (e.changedTouches) {
                var touches = e.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var idx = this.ongoingTouchIndexById(touches[i].identifier);
                    this._onGoingTouches.splice(idx, 1);
                }
            }
            else {
                var idx = this.ongoingTouchIndexById(e.pointerId);
                this._onGoingTouches.splice(idx, 1);
            }
        },
        
        handleTouchCancel : function(e){
            e.preventDefault();
            if (e.changedTouches) {
                var touches = e.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var idx = this.ongoingTouchIndexById(touches[i].identifier);
                    this._onGoingTouches.splice(idx, 1);
                }
            }
            else {
                var idx = this.ongoingTouchIndexById(e.pointerId);
                this._onGoingTouches.splice(idx, 1);
            }
        },
        
        handleTouchMove : function(e){
            e.preventDefault();
            if (e.changedTouches) {
                var touches = e.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var idx = this.ongoingTouchIndexById(touches[i].identifier);
                    if (idx >= 0) {
                        this._onGoingTouches.splice(idx, 1, this.copyTouch(touches[i]));
                    }
                }
            }
            else {
                var idx = this.ongoingTouchIndexById(e.pointerId);
                if (idx >= 0) {
                    this._onGoingTouches.splice(idx, 1, this.copyTouch(e));
                }
            }
        },
        
        copyTouch: function (touch) {
            if (touch.pointerId) {
                return { identifier: touch.pointerId, pageX: touch.pageX, pageY: touch.pageY };
            }
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