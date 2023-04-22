// Import the Player class

describe("Player", () => {
  let player;

  beforeEach(() => {
    player = new Player({
      x: 350,
      y: 700,
      width: 50,
      height: 50,
      speed: 5,
      gameWidth: 774,
    });
  });

  test("constructor initializes player properties correctly", () => {
    expect(player.x).toBe(350);
    expect(player.y).toBe(700);
    expect(player.width).toBe(50);
    expect(player.height).toBe(50);
    expect(player.speed).toBe(5);
    expect(player.gameWidth).toBe(774);

    expect(player.element).toBeDefined();
    expect(player.element.src).toContain("assets/images/ship-transparent.png");
  });

  test("move method updates player position", () => {
    const initialX = player.x;
    const deltaTime = 1;
    player.move("left", deltaTime);
    expect(player.x).toBe(initialX - player.speed * deltaTime);

    player.move("right", deltaTime);
    expect(player.x).toBe(initialX);
  });

  test("update method updates player element style", () => {
    player.x = 400;
    player.y = 700;
    player.update("left", 1);

    expect(player.element.style.transform).toBe(
      `translate(${player.x}px, ${player.y}px)`
    );
  });

  test("move method respects game boundaries", () => {
    const deltaTime = 1;
    player.x = 0;
    player.move("left", deltaTime);
    expect(player.x).toBe(0);

    player.x = player.gameWidth - player.width;
    player.move("right", deltaTime);
    expect(player.x).toBe(player.gameWidth - player.width);

    player.x = 3;
    player.move("left", deltaTime);
    expect(player.x).toBe(0);

    player.x = player.gameWidth - player.width - 2;
    player.move("right", deltaTime);
    expect(player.x).toBe(player.gameWidth - player.width);
  });

  test("shoot method creates a new bullet in the correct position", () => {
    const bullet = player.shoot();
    const initialX = player.x + player.width / 2 - bullet.width / 2;
    const initialY = player.y + bullet.height / 2;

    expect(bullet).toBeInstanceOf(Bullet);
    expect(bullet.x).toBe(initialX);
    expect(bullet.y).toBe(initialY);
  });
});
