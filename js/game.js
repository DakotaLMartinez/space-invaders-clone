class Game {
  constructor({ container }) {
    this.container = container;
    this.isGameOver = false;
    this.bullets = [];
    this.enemies = [];
    this.isPaused = false;
    this.timeSinceLastSpawn = 60 * 3;
    this.enemySpawnInterval = 60 * 3; // Spawn an enemy every 3 seconds at 60fps
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
      " ": false
    };

    this.container.append(this.player.element);
    this.setupPlayerControls();
    this.setupSounds();
  }

  setupPlayerControls() {
    this.keydownHandler = (e) => {
      if (this.keyStates.hasOwnProperty(e.key)) {
        this.keyStates[e.key] = true;
      }

      if (e.key === "p" || e.key === "P") {
        this.togglePause();
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

  setupSounds() {
    this.gameOverSound = new AudioController({
      src: "assets/sounds/gameOver.wav",
      volume: 0.7,
    });
    this.backgroundMusic = new AudioController({
      src: "assets/sounds/Otjanbird-Pt-1.mp3",
      isLoop: true,
      volume: 0.7,
    });
    setTimeout(() => {
      this.backgroundMusic.play();
    }, 200);
  }

  gameOver() {
    this.isGameOver = true;
  }

  addBullet(bullet) {
    this.bullets.push(bullet);
    this.container.appendChild(bullet.element);
  }

  enemyBulletHandler(e) {
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
            this.removeEnemy(enemy);
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
    if (this.keyStates[" "]) {
      const bullet = this.player.shoot();
      this.addBullet(bullet); 
    }
  }

  updateEnemies(deltaTime) {
    this.enemies.forEach((enemy) => {
      enemy.update(deltaTime);
    });
  }

  removeEnemy(enemy) {
    const index = this.enemies.indexOf(enemy);
    if (index > -1) {
      this.enemies.splice(index, 1);
      window.setTimeout(() => {
        enemy.element.remove();
      }, 2000);
    }
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
      game: this,
    });

    this.enemies.push(enemy);
    this.container.appendChild(enemy.element);
  }

  loop(currentTime) {
    if (this.isGameOver) {
      this.gameOverSound.play();
      return;
    }
    if (!this.isPaused) {
      // Calculate deltaTime
      if (this.lastFrameTime) {
        const deltaTime =
          (currentTime - this.lastFrameTime) / this.frameDuration;

        // Update player
        this.updatePlayer(deltaTime);

        // Update enemies
        this.updateEnemies(deltaTime);

        // Update bullets
        this.updateBullets(deltaTime);

        this.timeSinceLastSpawn += deltaTime;
        if (this.timeSinceLastSpawn >= this.enemySpawnInterval) {
          this.spawnEnemy();
          this.timeSinceLastSpawn = 0;
        }
      }
    }

    this.lastFrameTime = currentTime;
    requestAnimationFrame(this.loop);
  }

  start() {
    this.loop(0);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }
}

if (typeof process !== "undefined") {
  if (process.env.NODE_ENV === "test") {
    module.exports = {
      Game,
    };
  }
}
