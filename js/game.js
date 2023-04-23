class Game {
  constructor({ container }) {
    this.container = container;
    this.bullets = [];
    this.lastFrameTime = null;
    this.frameRate = 60;
    this.frameDuration = 1000 / this.frameRate;
    this.loop = this.loop.bind(this); // Bind the loop method to the instance

    this.player = new Player({
      x: container.clientWidth / 2 - 37,
      y: container.clientHeight - 74,
      width: 74,
      height: 74,
      speed: 5,
      gameWidth: this.container.clientWidth,
    });

    this.keyStates = {
      ArrowLeft: false,
      ArrowRight: false,
    };

    this.container.append(this.player.element);
    this.setupPlayerControls();
  }

  setupPlayerControls() {
    this.keydownHandler = (e) => {
      if (this.keyStates.hasOwnProperty(e.key)) {
        this.keyStates[e.key] = true;
      }

      if (e.code === "Space") {
        const bullet = this.player.shoot();
        this.addBullet(bullet);
      }
    };
    this.keyupHandler = (e) => {
      if (this.keyStates.hasOwnProperty(e.key)) {
        this.keyStates[e.key] = false;
      }
    };
    window.addEventListener("keydown", this.keydownHandler);
    window.addEventListener("keyup", this.keyupHandler);
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
      if (
        bullet.isOutOfBounds(
          this.container.clientHeight,
          this.container.clientWidth
        )
      ) {
        this.removeBullet(bullet);
      } else if (bullet.isColliding(this.player)) {
        this.player.onCollision();
        window.removeEventListener("keydown", this.keydownHandler);
        window.removeEventListener("keyup", this.keyupHandler);
        this.removeBullet(bullet);
      }
    });
  }

  updatePlayer(deltaTime) {
    if (this.keyStates.ArrowLeft) {
      this.player.update("left", deltaTime);
    }
    if (this.keyStates.ArrowRight) {
      this.player.update("right", deltaTime);
    }
  }

  loop(currentTime) {
    // Calculate deltaTime
    if (this.lastFrameTime) {
      const deltaTime = (currentTime - this.lastFrameTime) / this.frameDuration;

      // Update player
      this.updatePlayer(deltaTime);

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
      Game,
    };
  }
}
