describe("AudioController", () => {
  const mockAudio = {
    play: jest.fn(),
    pause: jest.fn(),
    volume: 1.0
  };

  beforeEach(() => {
    window.HTMLMediaElement.prototype.play = jest.fn();
    window.HTMLMediaElement.prototype.pause = jest.fn();
    global.Audio = jest.fn(() => { return { ...mockAudio } } );
    AudioController.sounds = [];
  });

  test("play method plays the audio", () => {
    const audioController = new AudioController({ src: "test-src1" });
    audioController.play();
    expect(mockAudio.play).toHaveBeenCalled();
  });

  test("pause method pauses the audio", () => {
    const audioController = new AudioController({ src: "test-src2" });
    audioController.pause();
    expect(mockAudio.pause).toHaveBeenCalled();
  });

  test("setVolume method sets the volume", () => {
    const audioController = new AudioController({ src: "test-src3" });
    audioController.setVolume(0.5);
    expect(audioController.audio.volume).toBe(0.5);
  });

  test("constructor sets loop and volume", () => {
    const audioController = new AudioController({
      src: "test-src4",
      isLoop: true,
      volume: 0.5,
    });
    expect(audioController.audio.loop).toBe(true);
    expect(audioController.audio.volume).toBe(0.5);
  });

  test("setVolumeForAll method sets the volume for all instances", () => {
    const audioController1 = new AudioController({
      src: "test-src5",
      isLoop: false,
      volume: 1.0
    });
    const audioController2 = new AudioController({
      src: "test-src6",
      isLoop: false,
      volume: 0.5
    });
    AudioController.setVolumeForAll(0.5);
    
    expect(audioController1.audio.volume).toBe(0.5);
    expect(audioController2.audio.volume).toBe(0.25);
  });

  test("mute method sets the volume for all instances to 0", () => {
    const audioController1 = new AudioController({
      src: "test-src1",
      isLoop: false
    });
    const audioController2 = new AudioController({
      src: "test-src2",
      isLoop: false
    });

    AudioController.mute();

    expect(audioController1.audio.volume).toBe(0);
    expect(audioController2.audio.volume).toBe(0);
  });
});
