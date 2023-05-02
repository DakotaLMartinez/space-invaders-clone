class Game {
  constructor({ container }) {
    this.container = container;
    this.ui = new UI(this);
    this.isPaused = true;
    this.level = 1;
    this.score = 0;
    this.pointsPerShipDestroyed = 5;
    this.scoreToLevelUp = 10;
    this.mainMessages = [
      "Level 1",
      "Instructions:",
      "Use Left and Right Arrow keys to move",
      "Press Spacebar to shoot",
      "Press P to pause/unpause",
    ];
    this.ui.display();
    this.isGameOver = false;

    this.bullets = [];
    this.enemies = [];
    this.timeSinceLastSpawn = 60 * 3;
    this.enemySpawnInterval = 60 * 3; // Spawn an enemy every 3 seconds at 60fps
    this.enemySpawnTimer = null;
    this.enemyFiringRate = 4;
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
      " ": false,
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
  }

  levelUp() {
    this.level++;
    this.isPaused = true;
    this.mainMessages = [`Level ${this.level}`, "Get ready!"];
    this.ui.display();
    this.pointsPerShipDestroyed *= 2;
    this.scoreToLevelUp = Math.floor(this.scoreToLevelUp * 2.5);
    this.increaseEnemyFiringRate();
    this.increaseEnemySpawnRate();

    setTimeout(() => {
      this.togglePause();
    }, 3000); // Pause for 3 seconds before resuming
  }

  increaseScore() {
    this.score += this.pointsPerShipDestroyed;
    if (this.score >= this.scoreToLevelUp) {
      this.levelUp();
    }
  }

  increaseEnemyFiringRate() {
    this.enemyFiringRate *= 0.9;
  }

  increaseEnemySpawnRate() {
    this.enemySpawnInterval *= 0.93
  }

  togglePause(messages = ["Paused"]) {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.backgroundMusic.pause();
      this.mainMessages = messages;
      this.container.classList.add("paused"); // Add 'paused' class when the game is paused
    } else {
      this.mainMessages = [];
      this.backgroundMusic.play();
      this.container.classList.remove("paused"); // Remove 'paused' class when the game is unpaused
    }
  }

  gameOver() {
    this.isGameOver = true;
    this.togglePause();
    this.mainMessages = ["Game Over"];
    this.ui.display();
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
            this.destroyEnemy(enemy);
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
      const bullet = this.player.shootIfReady(deltaTime);
      if (bullet) {
        this.addBullet(bullet);
      }
    } else {
      this.player.refreshCooldown(deltaTime);
    }
  }

  updateEnemies(deltaTime) {
    this.enemies.forEach((enemy) => {
      enemy.update(deltaTime);
    });
  }

  destroyEnemy(enemy) {
    enemy.onCollision();
    this.increaseScore();
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
    const y = 23;
    const enemy = new Enemy({
      x,
      y,
      width: enemyWidth,
      height: enemyHeight,
      gameWidth: this.container.clientWidth,
      onShoot: (bullet) => {
        this.addBullet(bullet);
      },
      enemyFiringRate: this.enemyFiringRate,
      speed: { x: 0, y: 0 },
      game: this,
    });

    this.enemies.push(enemy);
    this.container.appendChild(enemy.element);
    return enemy;
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

    this.ui.display();
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
