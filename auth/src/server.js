const app = require("./app");
const messaging = require("./messeging");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;
const DB = process.env.MONGO_DB_NAME;
if (!MONGO_USERNAME || !MONGO_PASSWORD || !DB || !MONGO_HOST || !MONGO_PORT) {
  throw new Error(
    "MONGO_USERNAME, MONGO_PASSWORD, and DB environment variables are required"
  );
  exit(1);
}
const MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${DB}`;
console.log(MONGO_URI);
// Connect to MongoDB
mongoose
  .connect(MONGO_URI + "?authSource=admin")
  .then(async () => {
    try {
      await messaging.publisher.connect();
      console.log("Messaging system initialized", "✅");
    } catch (err) {
      console.error("Failed to initialize messaging:", "❌", err);
    }
  })
  .then(() => {
    console.log("Connected to MongoDB", "✅");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`, "✅");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", "❌", err);
  });
