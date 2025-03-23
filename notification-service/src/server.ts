import { createClient } from "redis";
import app from "./app";
import mongoose from "mongoose";
import { connectRabbitMQ } from "./utils/rabbitmq";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

const PORT = process.env.PORT || 3003;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://root:example@localhost:27017/notificationdb";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Wait for Redis connection before starting the server
    redisClient.on("connect", () => {
      console.log("Connected to Redis, starting server...");
      app.listen(PORT, () => {
        console.log(`Notification Service running on port ${PORT}`);
      });
    });

    redisClient.on("error", (err) => {
      console.error("Redis connection failed, server not started:", err);
    });

    redisClient.connect();

    // connect to RabbitMQ
    await connectRabbitMQ();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
