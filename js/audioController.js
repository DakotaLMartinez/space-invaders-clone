class AudioController {
  static sounds = [];

  constructor({ src, isLoop, volume }) {
    this.audio = new Audio(src);
    this.audio.loop = isLoop || false;
    this.audio.volume = volume || 1.0;
    AudioController.sounds.push(this);
  }

  play() {
    this.audio.currentTime = 0;
    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  setVolume(volume) {
    this.audio.volume = volume;
  }

  static setVolumeForAll(multiplier) {
    return AudioController.sounds.map((sound) => {
      sound.setVolume(sound.audio.volume * multiplier);
      return sound;
    });
  }

  static mute() {
    AudioController.setVolumeForAll(0);
  }
}

if (typeof process !== "undefined") {
  if (process.env.NODE_ENV === "test") {
    module.exports = {
      AudioController,
    };
  }
}
