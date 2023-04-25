class Enemy {
  constructor({ x, y, width, height, gameWidth, speed, onShoot }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.gameWidth = gameWidth;
    this.speed = speed;
    this.element = Enemy.createElement(this);
    this.onShoot = onShoot;
    this.shootInterval = 3000; // Shoot every 3000 ms
    this.shootTimer = null;
    this.startShooting();
  }

  static createElement(enemy) {
    const el = document.createElement("img");
    el.class = "enemy";
    el.src = "assets/images/transparent-enemy.png";
    el.alt = "enemy";
    el.height = enemy.height;
    el.width = enemy.width;
    el.dataset.x = enemy.x;
    return el;
  }

  onCollision() {
    // Do something when the enemy is hit by a player's bullet
    this.element.src = "assets/images/explosion-transparent.png";
    this.dead = true;
    this.stopShooting();
    window.setTimeout(() => {
      this.element.remove();
    }, 2000);
  }

  startShooting() {
    this.shootTimer = setInterval(() => {
      this.shoot();
    }, this.shootInterval);
  }

  stopShooting() {
    clearInterval(this.shootTimer);
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
    console.log('this.x', this.x, 'bullet.x', bullet.x)
    this.onShoot(bullet);
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
  }
}

if (typeof process !== "undefined") {
  if (process.env.NODE_ENV === "test") {
    module.exports = {
      Enemy,
    };
  }
}
