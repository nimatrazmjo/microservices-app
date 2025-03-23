"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const redisClient = redis_1.default.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});
redisClient.connect();
exports.default = redisClient;
