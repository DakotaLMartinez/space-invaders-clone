describe("UI", () => {
  let container;
  let game;
  let ui;

  beforeEach(() => {
    container = document.createElement("div");
    container.style.width = "674px";
    container.style.height = "674px";
    Object.defineProperty(container, "clientWidth", {
      value: 674,
    });
    Object.defineProperty(container, "clientHeight", {
      value: 674,
    });
    game = new Game({ container });
    ui = new UI(game);
  });

  test("displays level, score, and main messages when the game is paused", () => {
    game.level = 2;
    game.score = 100;
    game.mainMessages = ["Line 1", "Line 2"];
    game.isPaused = true;

    ui.display();

    expect(ui.levelElement.textContent).toBe("Level: 2");
    expect(ui.scoreElement.textContent).toBe("Score: 100");
    expect(ui.mainMessageElement.innerHTML).toBe("<p>Line 1</p><p>Line 2</p>");
    expect(ui.mainMessageElement.style.display).toBe("flex");
  });

  test("hides main messages and displays level and score when the game is not paused", () => {
    game.level = 3;
    game.score = 200;
    game.mainMessages = ["Line 1", "Line 2"];
    game.isPaused = false;

    ui.display();

    expect(ui.levelElement.textContent).toBe("Level: 3");
    expect(ui.scoreElement.textContent).toBe("Score: 200");
    expect(ui.mainMessageElement.style.display).toBe("none");
  });
});

