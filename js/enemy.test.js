describe("Enemy", () => {
  let enemy;

  beforeEach(() => {
    enemy = new Enemy({
      x: 100,
      y: 0,
      width: 46,
      height: 82,
      gameWidth: 774,
      onShoot: () => {}
    });
  });

  test("constructor initializes properties correctly", () => {
    expect(enemy.x).toBe(100);
    expect(enemy.y).toBe(0);
    expect(enemy.width).toBe(46);
    expect(enemy.height).toBe(82);
    expect(enemy.gameWidth).toBe(774);
    expect(enemy.element).toBeTruthy();
  });

  test("onCollision removes enemy element", () => {
    document.body.appendChild(enemy.element);
    enemy.onCollision();
    expect(enemy.dead).toBe(true);
  });

  test("Enemy stops shooting when destroyed", () => {
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

    const stopShootingSpy = jest.spyOn(enemy, "stopShooting");

    enemy.onCollision(); // Destroy the enemy

    expect(stopShootingSpy).toHaveBeenCalled();

    stopShootingSpy.mockRestore();
  });

  test("startShooting and stopShooting control bullet shooting", () => {
    jest.useFakeTimers();
    const shootSpy = jest.spyOn(enemy, "shoot");

    enemy.startShooting();
    jest.advanceTimersByTime(enemy.shootInterval * 3);
    expect(shootSpy).toHaveBeenCalledTimes(3);

    enemy.stopShooting();
    jest.advanceTimersByTime(enemy.shootInterval * 3);
    expect(shootSpy).toHaveBeenCalledTimes(3);

    shootSpy.mockRestore();
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
