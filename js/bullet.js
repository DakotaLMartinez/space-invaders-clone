class Bullet {
  constructor({ x, y, width, height, color, speed }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = speed;
    this.element = Bullet.createElement(this);
  }

  static createElement(bullet) {
    const el = document.createElement("div");
    el.className = "bullet";
    el.style.backgroundColor = bullet.color;
    el.style.width = bullet.width + "px";
    el.style.height = bullet.height + "px";
    el.style.borderRadius = "50%";
    el.style.transform = `translate(${bullet.x}px, ${bullet.y}px)`;
    return el;
  }

  isColliding(spaceShip) {
    const bulletRect = this.element.getBoundingClientRect();
    const spaceShipRect = spaceShip.element.getBoundingClientRect();

    return (
      bulletRect.left < spaceShipRect.right &&
      bulletRect.right > spaceShipRect.left &&
      bulletRect.top < spaceShipRect.bottom &&
      bulletRect.bottom > spaceShipRect.top
    );
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
      Bullet,
    };
  }
}
