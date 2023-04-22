describe("Bullet", () => {
  let bullet;

  beforeEach(() => {
    bullet = new Bullet({
      x: 10,
      y: 20,
      width: 5,
      height: 10,
      color: "red",
      speed: { x: 0, y: 300 },
    });
  });

  test("constructor initializes bullet properties correctly", () => {
    expect(bullet.x).toBe(10);
    expect(bullet.y).toBe(20);
    expect(bullet.width).toBe(5);
    expect(bullet.height).toBe(10);
    expect(bullet.color).toBe("red");
    expect(bullet.speed.x).toBe(0);
    expect(bullet.speed.y).toBe(300);

    expect(bullet.element).toBeDefined();
    expect(bullet.element.style.backgroundColor).toBe("red");
    expect(bullet.element.style.width).toBe("5px");
    expect(bullet.element.style.height).toBe("10px");
  });

  test("move method updates bullet position", () => {
    const initialX = bullet.x;
    const initialY = bullet.y;
    bullet.move(1);
    expect(bullet.y).toBe(initialY + bullet.speed.y); // y position should decrease by bullet speed
    expect(bullet.x).toBe(initialX + bullet.speed.x); // y position should decrease by bullet speed
  });

  test("isOutOfBounds method detects when bullet is outside the game container", () => {
    // Test bullet within the game container
    const gameContainerHeight = 600;
    const gameContainerWidth = 600;
    expect(bullet.isOutOfBounds(gameContainerHeight, gameContainerWidth)).toBe(
      false
    );

    bullet.y = -5;
    expect(bullet.isOutOfBounds(gameContainerHeight, gameContainerWidth)).toBe(
      false
    );
    // Test bullet outside the game container
    bullet.y = -bullet.height;
    expect(bullet.isOutOfBounds(gameContainerHeight, gameContainerWidth)).toBe(
      true
    );

    bullet.y = 0;
    expect(bullet.isOutOfBounds(gameContainerHeight, gameContainerWidth)).toBe(
      false
    );
    bullet.x = -bullet.width;
    expect(bullet.isOutOfBounds(gameContainerHeight, gameContainerWidth)).toBe(
      true
    );
  });

  test("update method handles bullet movement", () => {
    const deltaTime = 1;
    const initialY = bullet.y;
    const initialX = bullet.x;
    bullet.update(deltaTime);

    expect(bullet.y).toBe(initialY + bullet.speed.y * deltaTime);
    expect(bullet.x).toBe(initialX + bullet.speed.x * deltaTime);
  });
});
