const app = require("./app");
const messaging = require("./messeging");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://root:example@mongodb:27017";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    try {
      await messaging.publisher.connect();
      console.log("Messaging system initialized");
    } catch (err) {
      console.error("Failed to initialize messaging:", err);
    }
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
