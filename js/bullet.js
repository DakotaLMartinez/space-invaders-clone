class Bullet {
  constructor(position, direction) {
    this.size = 6;
    this.element = Bullet.createElement();
    this.position = position;
    this.direction = direction;
    this.speed = 2;
  }

  static createElement() {
    const el = document.createElement("div");
    el.className = "bullet";
    return el;
  }

  draw() {
    this.element.style.top = `${this.position.top}px`;
    this.element.style.left = `${this.position.left}px`;
  }

  move() {
    const movingId = setInterval(() => {
      if (this.isInGame()) {
        if (this.isMovingUp()) {
          this.position.top -= this.speed;
        } else if (this.isMovingDown()) {
          this.position.top += this.speed;
        }
        this.draw();
      } else {
        clearInterval(movingId);
        this.element.remove();
      }
    }, 10)
  }

  isMovingUp() {
    return this.direction === "up";
  }

  isMovingDown() {
    return this.direction === "down";
  }
  
  isInGame() {
    return this.position.top > -5 && this.position.top < 775;
  }

  center() {
    return {
      x: this.position.left + this.size / 2,
      y: this.position.top + this.size / 2
    }
  }
}
