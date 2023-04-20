function isCollision(first, second) {
  const deltaX = (first.center().x - second.center().x) ** 2;
  const deltaY = (first.center().y - second.center().y) ** 2;
  const centerDistance = deltaX + deltaY;
  return (first.size + second.size) ** 2 >= centerDistance;
}