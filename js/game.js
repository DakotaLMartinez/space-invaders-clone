const gameScreen = document.querySelector('#game');
const player = new Player({ top: 700, left: 350 })
gameScreen.append(player.element);
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && player.position.left > 0) {
    player.position.left -= 5;
    player.draw();
  } else if (e.key === "ArrowRight" && player.position.left < 700) {
    player.position.left += 5;
    player.draw();
  }
  if (e.code === "Space") {
    const bullet = new Bullet({ top: 700, left: player.position.left + 34 }, "up");
    gameScreen.append(bullet.element);
    bullet.move();
  }
});
