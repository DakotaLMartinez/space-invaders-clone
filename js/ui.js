class UI {
  constructor(game) {
    this.game = game;
    this.container = game.container;

    this.levelElement = document.createElement("span");
    this.levelElement.className = "level-display";

    this.scoreElement = document.createElement("span");
    this.scoreElement.className = "score-display";

    this.mainMessageElement = document.createElement("div");
    this.mainMessageElement.className = "main-message-display";

    this.container.appendChild(this.levelElement);
    this.container.appendChild(this.scoreElement);
    this.container.appendChild(this.mainMessageElement);
  }

  display() {
    this.levelElement.textContent = `Level: ${this.game.level}`;
    this.scoreElement.textContent = `Score: ${this.game.score}`;

    if (this.game.isPaused) {
      this.mainMessageElement.innerHTML = this.game.mainMessages
        .map((message) => `<p>${message}</p>`)
        .join("");
      this.mainMessageElement.style.display = "flex";
    } else {
      this.mainMessageElement.style.display = "none";
    }
  }
}

if (typeof process !== "undefined") {
  if (process.env.NODE_ENV === "test") {
    module.exports = {
      UI,
    };
  }
}
