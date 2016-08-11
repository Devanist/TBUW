define(['Core/Utils'], function(Utils){
    
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
        this._soundsPlaying = [];
    };
    
    Speaker.prototype = {
        
        addSoundToLibrary : function(audioData, name){
            var that = this;
            this._context.decodeAudioData(audioData, function(soundBuffer){
                that._soundsLibrary[name] = soundBuffer;
            });
        },
        
        update: function(sounds){
            var t = null;
            for(let i = 0; i < sounds.length; i+=1){
                t = sounds[i];
                if(this._soundsLibrary.hasOwnProperty(t)){
                    if(!this.isSoundPlaying(t)){
                        this.play(t);
                    }
                }
            }
        },
        
        play : function(sound){
            var that = this;
            var node = this._context.createBufferSource();
            node.name = sound;
            node.buffer = this._soundsLibrary[sound];
            node.connect(this._context.destination);
            node.onended = function(){
                var l = that._soundsPlaying.length;
                for(var i = 0; i < l; i+=1){
                    if(that._soundsPlaying[i] === sound){
                        that._soundsPlaying.splice(i,1);
                    }
                }
            };
            this._soundsPlaying.push(sound);
            node.start(0);
        },
        
        isSoundPlaying : function(sound){
            var l = this._soundsPlaying.length;
            for(var i = 0; i < l; i+=1){
                if(this._soundsPlaying[i] === sound){
                    return true;
                }
            }
            return false;
        }
        
    };
    
    return Speaker;
    
});