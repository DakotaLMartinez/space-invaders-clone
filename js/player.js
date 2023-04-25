class Player {
  constructor({ x, y, width, height, speed, gameWidth, onPlayerExplosion }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.gameWidth = gameWidth;
    this.element = Player.createElement(this);
    this.onPlayerExplosion = onPlayerExplosion;
  }

  static createElement(player) {
    const el = document.createElement("img");
    el.id = "player";
    el.src = "assets/images/ship-transparent.png";
    el.alt = "spaceship";
    el.height = player.height;
    el.width = player.width;
    el.style.transform = `translate(${player.x}px, ${player.y}px)`;
    return el;
  }

  move(direction, deltaTime) {
    const delta = this.speed * deltaTime;
    if (direction === "left") {
      this.x = Math.max(0, this.x - delta);
    } else if (direction === "right") {
      this.x = Math.min(this.gameWidth - this.width, this.x + delta);
    }
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  update(direction, deltaTime) {
    if (["left", "right"].includes(direction)) {
      this.move(direction, deltaTime);
    }
  }

  shoot() {
    return new Bullet({
      x: this.center().x - 3,
      y: this.y + 5,
      width: 6,
      height: 10,
      color: "red",
      speed: { x: 0, y: -3.5 },
    });
  }

  explode() {
    this.element.src = "assets/images/explosion-transparent.png";
    this.onPlayerExplosion();
  }

  onCollision() {
    this.explode();
  }

  center() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
  }
}

if (typeof process !== "undefined") {
  if (process.env.NODE_ENV === "test") {
    module.exports = {
      Player,
    };
  }
}
