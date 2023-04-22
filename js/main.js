// Get the game container element
const container = document.getElementById("game");

// Create a new Game instance
const game = new Game({ container });

// Create a bullet and add it to the game
const bullet = new Bullet({
  x: 240,
  y: 50,
  width: 5,
  height: 10,
  color: "white",
  speed: { x: 0, y: 4.5 },
});

game.start();
setTimeout(() => {
  game.addBullet(bullet);
}, 300)