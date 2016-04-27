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
        this._soundsLibrary = {};
    };
    
    Speaker.prototype = {
        
        addSoundToLibrary : function(audioData, name){
            var temp = this._context.createBufferSource();
            var soundBuffer = null;
            var that = this;
            this._context.decodeAudioData(audioData, function(soundBuffer){
                temp.buffer = soundBuffer;
                temp.connect(that._context.destination);
                that._soundsLibrary[name] = temp;
            });
        },
        
        update: function(sounds){
            var l = sounds.length;
            var t = null;
            for(var i = 0; i < l; i+=1){
                t = sounds[i];
                if(this._soundsLibrary.hasOwnProperty(t)){
                    this._soundsLibrary[t].start(0);
                    console.log("playing sounds");
                }
            }
        }
        
    };
    
    return Speaker;
    
});