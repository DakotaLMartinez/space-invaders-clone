describe("Game", () => {
  let game;
  let container;

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
  });

  test("constructor initializes game properties correctly", () => {
    expect(game.container).toBe(container);
    expect(game.bullets).toEqual([]);
    expect(game.lastFrameTime).toBeNull();
    expect(game.frameRate).toBe(60);
    expect(game.frameDuration).toBe(1000 / game.frameRate);
    expect(game.player).toBeDefined();
    expect(game.enemyFiringRate).toBe(4);
    expect(game.keyStates).toEqual({
      ArrowLeft: false,
      ArrowRight: false,
      " ": false,
    });
  });

  test("addBullet method adds bullet to bullets array and appends bullet element to container", () => {
    const bullet = game.player.shoot();
    game.addBullet(bullet);
    expect(game.bullets.length).toBe(1);
    expect(game.bullets[0]).toBe(bullet);
    expect(container.contains(bullet.element)).toBe(true);
  });

  test("removeBullet method removes bullet from bullets array and removes bullet element from container", () => {
    const bullet = game.player.shoot();
    game.addBullet(bullet);
    game.removeBullet(bullet);
    expect(game.bullets.length).toBe(0);
    expect(container.contains(bullet.element)).toBe(false);
  });

  test("updatePlayer method updates player position based on key states", () => {
    const initialX = game.player.x;
    game.keyStates.ArrowLeft = true;
    game.updatePlayer(1);
    expect(game.player.x).toBe(initialX - game.player.speed);

    game.keyStates.ArrowLeft = false;
    game.keyStates.ArrowRight = true;
    game.updatePlayer(1);
    expect(game.player.x).toBe(initialX);
  });

  test("player onCollision is called when a bullet collides with the player", () => {
    const enemyBullet = new Bullet({
      x: game.player.x + game.player.width / 2,
      y: game.player.y - 10,
      width: 6,
      height: 10,
      color: "blue",
      speed: { x: 0, y: 3.5 },
    });

    game.addBullet(enemyBullet);

    const playerOnCollisionSpy = jest.spyOn(game.player, "onCollision");

    const playerRectMock = {
      left: game.player.x,
      right: game.player.x + game.player.width,
      top: game.player.y,
      bottom: game.player.y + game.player.height,
    };

    const bulletRectMock = {
      left: enemyBullet.x,
      right: enemyBullet.x + enemyBullet.width,
      top: enemyBullet.y + enemyBullet.speed.y,
      bottom: enemyBullet.y + enemyBullet.height + enemyBullet.speed.y,
    };

    game.player.element.getBoundingClientRect = jest.fn(() => playerRectMock);
    enemyBullet.element.getBoundingClientRect = jest.fn(() => bulletRectMock);

    game.updateBullets(1);

    expect(playerOnCollisionSpy).toHaveBeenCalled();

    playerOnCollisionSpy.mockRestore();
  });

  test("spawnEnemy method adds an enemy to the game", () => {
    const initialEnemyCount = game.enemies.length;
    game.enemyFiringRate = 1;
    const enemy = game.spawnEnemy();
    expect(game.enemies.length).toBe(initialEnemyCount + 1);
    expect(game.container.contains(game.enemies[0].element)).toBe(true);
    expect(enemy.shootInterval).toEqual(60 * game.enemyFiringRate)
  });

  test("Game loop stops when the player is destroyed", () => {
    const game = new Game({ container });

    const loopSpy = jest.spyOn(game, "loop");
    const gameOverSpy = jest.spyOn(game, "gameOver");

    game.player.onCollision(); // Destroy the player

    expect(gameOverSpy).toHaveBeenCalled();

    // Call loop once more to make sure it stops running
    game.loop(0);

    // loop should have been called only once (during game.start())
    expect(loopSpy).toHaveBeenCalledTimes(1);

    loopSpy.mockRestore();
    gameOverSpy.mockRestore();
  });

  test("UI display method is called within the game loop", () => {
    // 1. Create a spy for game.ui.display()
    const uiDisplaySpy = jest.spyOn(game.ui, "display");

    // 2. Run the game loop for a specific amount of time
    jest.useFakeTimers();
    game.start();
    jest.advanceTimersByTime(5000); // Advance time by 5000 ms

    // 3. Check if the spy has been called
    expect(uiDisplaySpy).toHaveBeenCalled();

    // Clean up the spy
    uiDisplaySpy.mockRestore();
    jest.useRealTimers();
  });
  
  describe("leveling up", () => {
    test("levelUp increases the level and updates main messages", () => {
      game.levelUp();
  
      expect(game.level).toBe(2);
      expect(game.mainMessages).toEqual(["Level 2", "Get ready!"]);
    });

    test("increaseScore() should increase score by pointsPerShipDestroyed when an enemy is destroyed", () => {
      game.pointsPerShipDestroyed = 5;
      game.score = 0;
      game.increaseScore();

      expect(game.score).toBe(5);
    });

    test("should call levelUp() when score reaches scoreToLevelUp", () => {
      const levelUpSpy = jest.spyOn(game, "levelUp");
      game.scoreToLevelUp = 100;
      game.score = 95;
      game.pointsPerShipDestroyed = 5;
      game.increaseScore();

      expect(levelUpSpy).toHaveBeenCalled();
    });

    test("should increase pointsPerShipDestroyed when leveling up", () => {
      game.level = 1;
      game.pointsPerShipDestroyed = 5;
      game.levelUp();

      expect(game.pointsPerShipDestroyed).toBe(10); // Increment value as needed
    });

    test("should increase scoreToLevelUp when leveling up", () => {
      game.level = 1;
      game.scoreToLevelUp = 100;
      game.levelUp();

      expect(game.scoreToLevelUp).toBe(250); // Increment value as needed
    });

    test("level up process is triggered when the score reaches the required threshold", () => {
      const levelUpSpy = jest.spyOn(game, "levelUp");
      const initialScoreToLevelUp = game.scoreToLevelUp;

      // Simulate enemy spaceship destructions until the score reaches the threshold
      while (game.score < initialScoreToLevelUp) {
        game.increaseScore();
      }

      expect(levelUpSpy).toHaveBeenCalled();

      // Clean up the spy
      levelUpSpy.mockRestore();
    });

    test("score increases when an enemy spaceship is destroyed", () => {
      const initialScore = game.score;
      const initialPointsPerShipDestroyed = game.pointsPerShipDestroyed;

      // Create an enemy and add it to the game
      game.spawnEnemy();
      const enemy = game.enemies[game.enemies.length - 1];

      // Call onCollision() on the enemy
      game.destroyEnemy(enemy);

      expect(game.score).toBe(initialScore + initialPointsPerShipDestroyed);
    });

    test("should call increaseEnemyFiringRate() when levelUp() gets called", () => {
      const increaseEnemyFiringRateSpy = jest.spyOn(
        game,
        "increaseEnemyFiringRate"
      );
      game.levelUp();

      expect(increaseEnemyFiringRateSpy).toHaveBeenCalled();

      // Clean up the spy
      increaseEnemyFiringRateSpy.mockRestore();
    });

    test("should call increaseEnemySpawnRate() when levelUp() gets called", () => {
      const increaseEnemySpawnRate = jest.spyOn(
        game,
        "increaseEnemySpawnRate"
      );
      game.levelUp();

      expect(increaseEnemySpawnRate).toHaveBeenCalled();

      // Clean up the spy
      increaseEnemySpawnRate.mockRestore();
    });
  })


  describe("Stopping and starting", () => {
    const mockAudio = {
      play: jest.fn(),
      pause: jest.fn(),
      volume: 1.0,
    };

    const uiMock = {
      display: jest.fn(),
    };

    const customGame = new Game({ container: document.createElement("div") });
    customGame.ui = uiMock;

    beforeEach(() => {
      window.HTMLMediaElement.prototype.play = jest.fn();
      window.HTMLMediaElement.prototype.pause = jest.fn();
      global.Audio = jest.fn(() => {
        return { ...mockAudio };
      });
      AudioController.sounds = [];
    });

    test("Game over calls stops new enemies and bullets from being generated", () => {
      jest.useFakeTimers();
      game.start();

      jest.advanceTimersByTime(6000);
      const enemyCount = game.enemies.length;
      const bulletCount = game.bullets.length;
      console.log(enemyCount + bulletCount);
      // Call the gameOver method
      game.gameOver();

      jest.advanceTimersByTime(10000);

      expect(game.enemies.length).toEqual(enemyCount);
      expect(game.bullets.length).toEqual(bulletCount);

      jest.useRealTimers();
    });

    test("gameOver sets the Game Over message and updates the UI", () => {
      customGame.gameOver();
      expect(customGame.mainMessages).toEqual(["Game Over"]);
      expect(uiMock.display).toHaveBeenCalled();
    });

    test("togglePause displays the correct messages", () => {
      game.start();

      game.togglePause(); // start playing
      game.togglePause(); // pause
      expect(game.mainMessages).toEqual(["Paused"]);

      game.togglePause(); // resume playing
      game.togglePause(["Level up!", "Get ready!"]); // pause with message
      expect(game.mainMessages).toEqual(["Level up!", "Get ready!"]);
    });

    test("togglePause adds and removes paused class on the container", () => {
      game.start();
      game.togglePause();
      expect(game.container.classList.contains("paused")).toBe(false);

      game.togglePause();
      expect(game.container.classList.contains("paused")).toBe(true);

      game.togglePause();
      expect(game.container.classList.contains("paused")).toBe(false);
    });

    test("levelUp increases the level and updates main messages", () => {
      game.start();
      game.togglePause();
      game.levelUp();

      expect(game.level).toBe(2);
      expect(game.mainMessages).toEqual(["Level 2", "Get ready!"]);
      expect(game.isPaused).toBe(true); // Check if the game is paused during level up
    });

    test("pauses and resumes the game", () => {
      jest.useFakeTimers();
      game.start();
      expect(game.mainMessages).toEqual([
        "Level 1",
        "Instructions:",
        "Use Left and Right Arrow keys to move",
        "Press Spacebar to shoot",
        "Press P to pause/unpause",
      ]);
      const mainMessageContainer = container.querySelector(
        ".main-message-display"
      );
      expect(mainMessageContainer.style.display).toBe("flex");
      game.togglePause();
      expect(game.mainMessages).toEqual([]);

      jest.advanceTimersByTime(5000);
      expect(mainMessageContainer.style.display).toBe("none");
      const initialPlayerPosition = { ...game.player };
      const initialEnemyPosition = { ...game.enemies[0] };
      const initialBulletPosition = { ...game.bullets[0] };

      game.togglePause();

      jest.advanceTimersByTime(5000); // Advance time by 5000 ms

      const keydownEvent = new KeyboardEvent("keydown", { key: "ArrowLeft" });
      const keyupEvent = new KeyboardEvent("keyup", { key: "ArrowLeft" });

      window.dispatchEvent(keydownEvent);

      jest.advanceTimersByTime(1000);
      // Simulate releasing the left arrow key
      window.dispatchEvent(keyupEvent);

      // Check that the player's position has not changed
      expect(game.player.x).toEqual(initialPlayerPosition.x);
      expect(game.enemies[0]).toEqual(initialEnemyPosition);
      expect(game.bullets[0]).toEqual(initialBulletPosition);

      // Check if the player, enemies, and bullets have not moved

      game.togglePause();
      window.dispatchEvent(keydownEvent);

      jest.advanceTimersByTime(1000);
      // Simulate releasing the left arrow key
      window.dispatchEvent(keyupEvent);
      jest.advanceTimersByTime(5000); // Advance time by 5000 ms
      // Check if the player, enemies, and bullets have moved
      expect(game.player.x).not.toEqual(initialPlayerPosition.x);
      expect(game.enemies[0]).not.toEqual(initialEnemyPosition);
      expect(game.bullets[0]).not.toEqual(initialBulletPosition);
      // Clean up the event listeners
      window.removeEventListener("keydown", game.keydownHandler);
      window.removeEventListener("keyup", game.keyupHandler);
      jest.useRealTimers();
    });
  });
});
