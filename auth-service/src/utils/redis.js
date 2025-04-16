const redis = require("redis");

// Create a Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://host.docker.internal:6379",
});

// Handle connection errors
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Connect to Redis
redisClient.connect();

// log message to console if redis is connected
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

module.exports = redisClient;
