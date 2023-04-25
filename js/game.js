class Game {
  constructor({ container }) {
    this.container = container;
    this.isGameOver = false;
    this.bullets = [];
    this.enemies = [];
    this.enemySpawnInterval = 4000; // Spawn an enemy every 2000 ms
    this.enemySpawnTimer = null;
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
      onPlayerExplosion: () => {
        this.gameOver();
      },
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

  gameOver() {
    this.isGameOver = true;
    this.enemies.forEach((enemy) => {
      enemy.stopShooting();
    });
    this.stopSpawningEnemies();
  }

  addBullet(bullet) {
    this.bullets.push(bullet);
    this.container.appendChild(bullet.element);
  }

  enemyBulletHandler(e) {
    console.log("handler running");
    const bullet = e.detail.bullet;
    this.addBullet(bullet);
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
      } else {
        let collided = false;

        // Check for collisions with the player
        if (bullet.isColliding(this.player) && bullet.speed.y > 0) {
          this.player.onCollision();
          window.removeEventListener("keydown", this.keydownHandler);
          window.removeEventListener("keyup", this.keyupHandler);
          collided = true;
        }

        // Check for collisions with enemies
        this.enemies.forEach((enemy) => {
          if (bullet.isColliding(enemy)) {
            enemy.onCollision();
            collided = true;
          }
        });

        if (collided) {
          this.removeBullet(bullet);
        }
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

  updateEnemies(deltaTime) {
    this.enemies.forEach((enemy) => {
      enemy.update(deltaTime);
    });
  }

  spawnEnemy() {
    const enemyWidth = 46;
    const enemyHeight = 82;
    const x = Math.random() * (this.container.clientWidth - enemyWidth);
    const y = 0;
    const enemy = new Enemy({
      x,
      y,
      width: enemyWidth,
      height: enemyHeight,
      gameWidth: this.container.clientWidth,
      onShoot: (bullet) => {
        this.addBullet(bullet);
      },
      speed: { x: 0, y: 0 },
    });

    this.enemies.push(enemy);
    this.container.appendChild(enemy.element);
  }

  loop(currentTime) {
    if (this.isGameOver) {
      return;
    }
    // Calculate deltaTime
    if (this.lastFrameTime) {
      const deltaTime = (currentTime - this.lastFrameTime) / this.frameDuration;

      // Update player
      this.updatePlayer(deltaTime);

      // Update enemies
      this.updateEnemies(deltaTime);

      // Update bullets
      this.updateBullets(deltaTime);

      // if (Math.random() < 0.002) {
      //   this.spawnEnemy();
      // }
    }

    this.lastFrameTime = currentTime;
    requestAnimationFrame(this.loop);
  }

  start() {
    this.loop(0);
    this.startSpawningEnemies();
  }

  startSpawningEnemies() {
    this.spawnEnemy();
    this.enemySpawnTimer = setInterval(() => {
      this.spawnEnemy();
    }, this.enemySpawnInterval);
  }

  stopSpawningEnemies() {
    clearInterval(this.enemySpawnTimer);
  }
}

if (typeof process !== "undefined") {
  if (process.env.NODE_ENV === "test") {
    module.exports = {
      Game,
    };
  }
}
