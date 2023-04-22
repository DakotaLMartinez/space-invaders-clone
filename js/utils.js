class Utils {
  static isCollision(obj1, obj2) {
    // Check if two game objects (player, enemy, or bullet) are colliding
  }

  static createImageElement(src) {
    // Create an image element and set its source
  }

  static createDivElement(color) {
    // Create a div element and set its background color
  }

  static setPosition(element, x, y) {
    // Set the position of a DOM element using CSS properties
  }

  static setSize(element, width, height) {
    // Set the size of a DOM element using CSS properties
  }
}
function isCollision(first, second) {
  const deltaX = (first.center().x - second.center().x) ** 2;
  const deltaY = (first.center().y - second.center().y) ** 2;
  const centerDistance = deltaX + deltaY;
  return (first.size + second.size) ** 2 >= centerDistance;
}
