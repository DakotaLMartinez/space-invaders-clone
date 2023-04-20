class Player {
  constructor(position) {
    this.size = 74;
    this.element = Player.createElement(this.size);
    this.position = position;
  }

  static createElement(size) {
    const el = document.createElement("img");
    el.id = "player";
    el.src = "assets/images/ship-transparent.png";
    el.alt = "spaeship";
    el.height = `${size}`;
    el.width = `${size}`;
    return el;
  }

  draw() {
    this.element.style.top = `${this.position.top}px`;
    this.element.style.left = `${this.position.left}px`;
  }

  center() {
    return {
      x: this.position.left + this.size / 2,
      y: this.position.top + this.size / 2,
    };
  }
}
