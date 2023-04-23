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
      top: enemyBullet.y,
      bottom: enemyBullet.y + enemyBullet.height,
    };

    game.player.element.getBoundingClientRect = jest.fn(() => playerRectMock);
    enemyBullet.element.getBoundingClientRect = jest.fn(() => bulletRectMock);

    bulletRectMock.top += enemyBullet.speed.y;
    bulletRectMock.bottom += enemyBullet.speed.y;

    game.updateBullets(1);

    
    expect(playerOnCollisionSpy).toHaveBeenCalled();

    playerOnCollisionSpy.mockRestore();
  });
});
