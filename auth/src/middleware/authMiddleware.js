const jwt = require("jsonwebtoken");
const redisClient = require("../utils/redis");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Check Redis for token validity
    const userId = await redisClient.get(`token:${token}`);
    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request object
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
