const amqp = require("amqplib");

class Publisher {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queueName = "user_events";
  }

  async connect() {
    const RABBIT_USER = process.env.RABBITMQ_USER;
    const RABBIT_PASS = process.env.RABBITMQ_PASS;
    const RABBIT_HOST = process.env.RABBITMQ_HOST;
    const RABBIT_PORT = process.env.RABBITMQ_PORT;

    if (!RABBIT_USER || !RABBIT_PASS || !RABBIT_HOST || !RABBIT_PORT) {
      throw new Error(
        "RABBITMQ_USER, RABBITMQ_PASS, RABBITMQ_HOST, and RABBITMQ_PORT environment variables are required"
      );
    }
    const RABBITMQ_URL = `amqp://${RABBIT_USER}:${RABBIT_PASS}@${RABBIT_HOST}:${RABBIT_PORT}`;
    console.log(RABBITMQ_URL, "RABBITMQ_URL");
    console.log(
      " Connecting to RabbitMQ.............................",
      "\u001b[36m\u001b[1m\u0007"
    );
    this.connection = await amqp.connect(RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange("user_events", "topic", {
      durable: true,
    });
    console.log("Connected to RabbitMQ", "✅");
  }

  async publishEvent(eventType, userId, data = {}) {
    if (!this.channel) await this.connect();

    const message = {
      timestamp: new Date().toISOString(),
      eventType,
      userId,
      data,
    };

    await this.channel.publish(
      "user_events",
      eventType,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    console.log(`Published event: ${eventType} for user ${userId} `, "✅");
  }

  async close() {
    if (this.connection) await this.connection.close();
  }
}

// Singleton instance
module.exports = new Publisher();

// Usage:
// const publisher = new Publisher();
// await publisher.connect();
// await publisher.publishEvent("user_created", "user123", { name: "John Doe" });
// await publisher.close();
