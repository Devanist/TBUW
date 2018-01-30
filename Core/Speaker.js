export default class Speaker {
    constructor () {
        this._context = null;
        if (typeof AudioContext !== "undefined") {
            this._context = new AudioContext();
        }
        else if (typeof webkitAudioContext !== "undefined") {
            this._context = new webkitAudioContext();
        }
        else {
            throw new Error("AudioContext not supported!");
        }
        this._gainNode = this._context.createGain();
        this._gainNode.connect(this._context.destination);
        this._soundsLibrary = {};
        this._soundsPlaying = [];
    }

    addSoundToLibrary (audioData, name) {
        this._context.decodeAudioData(audioData, (soundBuffer) => { this._soundsLibrary[name] = soundBuffer });
    }

    update (sounds) {
        if (this._gainNode.gain.value < 1) {
            this._gainNode.gain.value += 0.005;
            if (this._gainNode.gain.value > 1) {
                this._gainNode.gain.value = 1;
            }
        }

        sounds.forEach((sound) => {
            if (sound.stop && (sound.name in this._soundsLibrary || sound.name === "all")) {
                this.stop(sound.name);
            }
            else if (sound.name in this._soundsLibrary) {
                if (!this.isSoundPlaying(sound.name)) this.play(sound);
            }
            else {
                throw new Error(`There is no sound like ${sound.name}`);
            }
        });
    }

    play (sound) {
        const FROM_BEGINNING = 0;
        const DEFAULT_OFFSET = 0;
        const MUTED = 0;

        const node = this._context.createBufferSource();
        let offset = DEFAULT_OFFSET;

        if (typeof sound === "string") {
            node.name = sound;
        }
        else if (typeof sound === "object") {
            node.name = sound.name;
            offset = sound.offset || DEFAULT_OFFSET;
        }

        node.buffer = this._soundsLibrary[node.name];
        if (sound.effect) {
            switch (sound.effect) {
                case "fadeIn":
                    this._gainNode.gain.value = MUTED;
                    node.connect(this._gainNode);
                    break;
                default:
                    throw new Error(`There is no effect like ${sound.effect}`);
            }
        }
        else {
            node.connect(this._context.destination);
        }

        node.onended = () => {
            this._soundsPlaying.forEach((soundPlaying, index) => {
                if (soundPlaying && soundPlaying.name === node.name) this._soundsPlaying.splice(index, 1);
            });
        };

        this._soundsPlaying.push(node);
        node.start(FROM_BEGINNING, offset);
    }

    isSoundPlaying (sound) {
        return this._soundsPlaying.some((soundPlaying) => soundPlaying.name === sound);
    }

    stop (sound) {
        const ONLY_ELEMENT = 0;
        if (sound === "all") {
            this._soundsPlaying.forEach((soundPlaying) => { soundPlaying.stop() });
            this._soundsPlaying = [];
        }
        else {
            const soundIndex = this._soundsPlaying.findIndex((soundPlaying) => soundPlaying.name === sound);
            this._soundsPlaying[soundIndex].stop();
            delete this._soundsPlaying.splice(soundIndex, 1)[ONLY_ELEMENT];
        }
    }
}
