const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const redisClient = require("../utils/redis");

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Cache user data in Redis
    await redisClient.set(`user:${user._id}`, JSON.stringify(user), "EX", 3600); // Cache for 1 hour

    // Cache JWT token in Redis
    await redisClient.set(`token:${token}`, user._id.toString(), "EX", 3600); // Cache for 1 hour

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUser = async (req, res) => {
  const userId = req.user.userId; // Assuming userId is extracted from the JWT token

  try {
    // Check Redis for cached user data
    const cachedUser = await redisClient.get(`user:${userId}`);
    if (cachedUser) {
      return res.status(200).json(JSON.parse(cachedUser));
    }

    // Fetch user data from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cache user data in Redis
    await redisClient.set(`user:${userId}`, JSON.stringify(user), "EX", 3600); // Cache for 1 hour

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
