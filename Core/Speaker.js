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
        this._gainNode = this._context.createGain();
        this._gainNode.connect(this._context.destination);
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
            if(this._gainNode.gain.value < 1){
                this._gainNode.gain.value += 0.005;
                if(this._gainNode.gain.value > 1){
                    this._gainNode.gain.value = 1;
                }
            }
            for(let i = 0; i < sounds.length; i+=1){
                t = sounds[i];
                if(this._soundsLibrary.hasOwnProperty(t) || this._soundsLibrary.hasOwnProperty(t.name)){
                    if(!this.isSoundPlaying(t) && !this.isSoundPlaying(t.name)){
                        this.play(t);
                    }
                }
            }
        },
        
        play : function(sound){
            var that = this;
            var node = this._context.createBufferSource();
            var offset = 0;
            if(typeof sound === "string"){
                node.name = sound;
            }
            else if(typeof sound === "object"){
                node.name = sound.name;
                offset = sound.offset;
            }
            node.buffer = this._soundsLibrary[node.name];
            if(sound.effect !== undefined){
                    switch(sound.effect){
                        case "fadeIn":
                            this._gainNode.gain.value = 0;
                            node.connect(this._gainNode);
                            break;
                        default:
                            console.log('There is no effect like ' + sound.effect);
                            break;
                    }
            }
            else{
                node.connect(this._context.destination);
            }
            node.onended = function(){
                var l = that._soundsPlaying.length;
                for(var i = 0; i < l; i+=1){
                    if(that._soundsPlaying[i].name === node.name){
                        that._soundsPlaying.splice(i,1);
                    }
                }
            };
            this._soundsPlaying.push({name: sound, node: node});
            node.start(0, offset);
        },
        
        isSoundPlaying : function(sound){
            var l = this._soundsPlaying.length;
            for(var i = 0; i < l; i+=1){
                if(this._soundsPlaying[i].name === sound){
                    return true;
                }
            }
            return false;
        },

        stop : function(sound){
            if(sound === "all"){
                for(let i = 0; i < this._soundsPlaying.length; i++){
                    this._soundsPlaying[i].node.stop();
                    delete this._soundsPlaying[i].node;
                }
                this._soundsPlaying = [];
            }
            else{
                for(let i = 0; i < this._soundsPlaying.length; i++){
                    if(this._soundsPlaying[i].name === sound){
                        this._soundsPlaying[i].node.stop();
                        delete this._soundsPlaying[i].node;
                        this._soundsPlaying.splice(i,1);
                    }
                }
            }
        }
        
    };
    
    return Speaker;
    
});