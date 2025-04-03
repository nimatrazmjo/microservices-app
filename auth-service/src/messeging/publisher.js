const amqp = require("amqplib");

class Publisher {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queueName = "user_events";
  }

  async connect() {
    if (!process.env.RABBITMQ_URL) {
      throw new Error("RABBITMQ_URL environment variable is not set");
    }
    console.log("Connecting to RabbitMQ.............................");
    this.connection = await amqp.connect(process.env.RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange("user_events", "topic", {
      durable: true,
    });
    console.log("Connected to RabbitMQ");
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
    console.log(`Published event: ${eventType} for user ${userId}`);
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
