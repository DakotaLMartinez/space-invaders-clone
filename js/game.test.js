describe("Game", () => {
  let game;
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    container.style.width = "774px";
    container.style.height = "774px";
    Object.defineProperty(container, "clientWidth", {
      value: 774,
    });
    Object.defineProperty(container, "clientHeight", {
      value: 774,
    });
    console.log(container.style.width);
    console.log(container.clientWidth);
    game = new Game({ container });
  });

  test("constructor initializes game properties correctly", () => {
    expect(game.container).toBe(container);
    expect(game.bullets).toEqual([]);
    expect(game.lastFrameTime).toBeNull();
    expect(game.frameRate).toBe(60);
    expect(game.frameDuration).toBe(1000 / game.frameRate);
    expect(game.player).toBeDefined();
    expect(game.keyStates).toEqual({
      ArrowLeft: false,
      ArrowRight: false,
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
    game.spawnEnemy();
    expect(game.enemies.length).toBe(initialEnemyCount + 1);
    expect(game.container.contains(game.enemies[0].element)).toBe(true);
  });

  test("startSpawningEnemies and stopSpawningEnemies control enemy spawning", () => {
    jest.useFakeTimers();

    game.startSpawningEnemies();
    jest.advanceTimersByTime(game.enemySpawnInterval * 3);
    expect(game.enemies.length).toBe(4);

    game.stopSpawningEnemies();
    jest.advanceTimersByTime(game.enemySpawnInterval * 3);
    expect(game.enemies.length).toBe(4);

    jest.useRealTimers();
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

  test("Game over calls appropriate methods to stop the game", () => {
    const stopSpawningEnemiesSpy = jest.spyOn(game, "stopSpawningEnemies");
    const enemyStopShootingSpy = jest.spyOn(Enemy.prototype, "stopShooting");

    game.spawnEnemy();

    // Call the gameOver method
    game.gameOver();

    expect(stopSpawningEnemiesSpy).toHaveBeenCalled(); // stopSpawningEnemies called
    expect(enemyStopShootingSpy).toHaveBeenCalled(); // stopShooting called on the enemy

    stopSpawningEnemiesSpy.mockRestore();
    enemyStopShootingSpy.mockRestore();
  });
});
