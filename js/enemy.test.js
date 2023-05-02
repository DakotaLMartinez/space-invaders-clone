describe("Enemy", () => {
  let enemy;
  let game;
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    game = new Game({ container });
    game.enemyFiringRate = 4;
    enemy = new Enemy({
      x: 100,
      y: 0,
      width: 46,
      height: 82,
      gameWidth: 774,
      speed: {x: 0, y: 0},
      onShoot: () => { },
      enemyFiringRate: game.enemyFiringRate,
      game: game,
    });
  });

  test("constructor initializes properties correctly", () => {
    expect(enemy.x).toBe(100);
    expect(enemy.y).toBe(0);
    expect(enemy.width).toBe(46);
    expect(enemy.height).toBe(82);
    expect(enemy.gameWidth).toBe(774);
    expect(enemy.element).toBeTruthy();
    expect(enemy.game).toBe(game);
  });

  test("onCollision removes enemy element", () => {
    document.body.appendChild(enemy.element);
    enemy.onCollision();
    expect(enemy.dead).toBe(true);
  });

  test("Enemy stops shooting when destroyed", () => {
    jest.useFakeTimers();

    const onShootMock = jest.fn();
    const game = { isPaused: false };
    const enemy = new Enemy({
      x: 10,
      y: 10,
      width: 50,
      height: 50,
      speed: { x: 0, y: 2 },
      gameWidth: 500,
      onShoot: onShootMock,
      game: game,
    });

    enemy.onCollision(); // Destroy the enemy
    jest.advanceTimersByTime(enemy.shootInterval * 3);

    expect(onShootMock).toHaveBeenCalledTimes(0);

    jest.useRealTimers();
  });

  test("update controls bullet shooting", () => {
    jest.useFakeTimers();
    const onShootMock = jest.fn();
    game.onShoot = onShootMock;
    

    const deltaTime = 1000 / 60; // Assuming 60 fps, deltaTime is 16.66.. ms per frame
    for (let i = 0; i < 3; i++) {
      jest.advanceTimersByTime(enemy.shootInterval);
      enemy.update(deltaTime * enemy.shootInterval);
    }
    
    expect(onShootMock).toHaveBeenCalledTimes(3);

    enemy.onCollision(); // Destroy the enemy
    jest.advanceTimersByTime(enemy.shootInterval * 3);
    enemy.update(deltaTime * enemy.shootInterval * 3);

    expect(onShootMock).toHaveBeenCalledTimes(3);

    jest.useRealTimers();
  });

  test("Enemy calls onShoot callback when shooting", () => {
    const onShootMock = jest.fn();
    const enemy = new Enemy({
      x: 10,
      y: 10,
      width: 50,
      height: 50,
      speed: 2,
      gameWidth: 500,
      onShoot: onShootMock,
    });

    enemy.shoot();

    expect(onShootMock).toHaveBeenCalled();
    expect(onShootMock.mock.calls[0][0]).toBeInstanceOf(Bullet);
  });
});
