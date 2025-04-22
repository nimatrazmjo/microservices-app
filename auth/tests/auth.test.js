const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/userModel");

describe("Authentication API", () => {
  beforeAll(async () => {
    jest.setTimeout(10000); // Increase timeout to 10 seconds

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear the users collection before running tests
    await User.deleteMany({});
  }, 10000); // 10 seconds timeout

  afterAll(async () => {
    // Close the MongoDB connection
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login an existing user", async () => {
    // First, register a user
    await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    // Then, login with the same user
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not login with invalid credentials", async () => {
    // First, register a user
    await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    // Then, try to login with an incorrect password
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });
});
