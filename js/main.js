// Get the game container element
const container = document.getElementById("game");

// Create a new Game instance
const game = new Game({ container });

const backgroundMusic = new AudioController({
  src: "assets/sounds/Otjanbird-Pt-1.mp3",
  isLoop: true,
  volume: 0.7
});

const playerShot = new AudioController({
  src: "assets/sounds/playerShot.wav",
  volume: 0.3
})

const enemyShot = new AudioController({
  src: "assets/sounds/enemyShot.wav",
  volume: 0.3
})

const enemyExplosion = new AudioController({
  src: "assets/sounds/enemyExplosion.wav",
  volume: 0.5
})

const gameOver = new AudioController({
  src: "assets/sounds/gameOver.wav",
  volume: 0.7
})

const playerExplosion = new AudioController({
  src: "assets/sounds/playerExplosion.wav",
  volume: 0.7
})

game.start();
backgroundMusic.play();
