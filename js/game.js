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


class Game {
  constructor({ container }) {
    this.container = container;
    this.bullets = [];
    this.lastFrameTime = null;
    this.frameRate = 60;
    this.frameDuration = 1000 / this.frameRate;
    this.loop = this.loop.bind(this); // Bind the loop method to the instance
  }

  addBullet(bullet) {
    this.bullets.push(bullet);
    this.container.appendChild(bullet.element);
  }

  removeBullet(bullet) {
    const index = this.bullets.indexOf(bullet);
    if (index > -1) {
      this.bullets.splice(index, 1);
      bullet.element.remove();
    }
  }

  updateBullets(deltaTime) {
    this.bullets.forEach((bullet) => {
      bullet.update(deltaTime);
      bullet.element.style.transform = `translate(${bullet.x}px, ${bullet.y}px)`;
      if (
        bullet.isOutOfBounds(
          this.container.clientHeight,
          this.container.clientWidth
        )
      ) {
        this.removeBullet(bullet);
      }
    });
  }

  loop(currentTime) {
    // Calculate deltaTime
    if (this.lastFrameTime) {
      const deltaTime = (currentTime - this.lastFrameTime) / this.frameDuration;

      // Update bullets
      this.updateBullets(deltaTime);
    }

    this.lastFrameTime = currentTime;
    requestAnimationFrame(this.loop);
  }

  start() {
    this.loop(0);
  }
}

if (typeof process !== "undefined") {
  if (process.env.NODE_ENV === "test") {
    module.exports = {
      Game
    }
  }
}