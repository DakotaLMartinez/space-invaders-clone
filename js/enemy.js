class Enemy {
  
}

if (typeof process !== "undefined") {
  if (process.env.NODE_ENV === "test") {
    module.exports = {
      Enemy,
    };
  }
}