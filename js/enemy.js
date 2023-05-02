class Enemy {
  constructor({
    x,
    y,
    width,
    height,
    gameWidth,
    speed,
    onShoot,
    enemyFiringRate,
    game,
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.gameWidth = gameWidth;
    this.speed = speed;
    this.element = Enemy.createElement(this);
    this.onShoot = onShoot;
    this.shootInterval = 60 * enemyFiringRate; // Shoot every 4 seconds at 60 fps
    this.shootTimer = null;
    this.timeSinceLastShot = 0;
    this.setupSounds();
    this.game = game;
  }

  static createElement(enemy) {
    const el = document.createElement("img");
    el.className = "enemy";
    el.src = "assets/images/transparent-enemy.png";
    el.alt = "enemy";
    el.height = enemy.height;
    el.width = enemy.width;
    el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    return el;
  }

  setupSounds() {
    this.explosion = new AudioController({
      src: "assets/sounds/enemyExplosion.wav",
      volume: 0.5,
    });
    this.shot = new AudioController({
      src: "assets/sounds/enemyShot.wav",
      volume: 0.3,
    });
  }

  onCollision() {
    // Do something when the enemy is hit by a player's bullet
    if (!this.dead) {
      this.dead = true;
      this.explode();
    }
  }

  explode() {
    this.element.src = "assets/images/explosion-transparent.png";
    this.explosion.play();
  }

  shoot() {
    const bullet = new Bullet({
      x: this.x + this.width / 2 - 3,
      y: this.y + this.height,
      width: 6,
      height: 10,
      color: "white",
      speed: { x: 0, y: 3.5 },
    });
    this.onShoot(bullet);
    this.shot.play();
  }

  move(deltaTime) {
    this.y += this.speed.y * deltaTime;
    this.x += this.speed.x * deltaTime;
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  isOutOfBounds(containerHeight, containerWidth) {
    const inYRange =
      -this.height < this.y && this.y < containerHeight + this.height;
    const inXRange =
      -this.width < this.x && this.x < containerWidth + this.width;
    return !(inXRange && inYRange);
  }

  update(deltaTime) {
    this.move(deltaTime);
    this.shootIfReady(deltaTime);
  }

  shootIfReady(deltaTime) {
    this.timeSinceLastShot += deltaTime;
    if (this.timeSinceLastShot >= this.shootInterval) {
      if (!this.game.isPaused && !this.dead) {
        this.shoot();
      }
      this.timeSinceLastShot = 0;
    }
  }
}

if (typeof process !== "undefined") {
  if (process.env.NODE_ENV === "test") {
    module.exports = {
      Enemy,
    };
  }
}
