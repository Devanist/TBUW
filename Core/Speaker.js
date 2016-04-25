define([], function(){
    
    var Speaker = function(){
        this._context = null;
        if(typeof AudioContext !== "undefined"){
            this._context = new AudioContext();
        }
        else if(typeof webkitAudioContext !== "undefined"){
            this._context = new webkitAudioContext();
        }
        else{
            throw new Error("AudioContext not supported!");
        }
        this._soundsLibrary = [];
    };
    
    Speaker.prototype = {
        
        addSoundToLibrary : function(audioData){
            var temp = this._context.createBufferSource();
            var soundBuffer = null;
            var that = this;
            this._context.decodeAudioData(audioData, function(soundBuffer){
                temp.buffer = soundBuffer;
                temp.connect(that._context.destination);
            });
        },
        
        update: function(){
            
        }
        
    };
    
    return Speaker;
    
});