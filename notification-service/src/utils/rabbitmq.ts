import amqp from "amqplib";

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

let channel: amqp.Channel;

export const connectRabbitMQ = async (): Promise<void> => {
  console.log("Connecting to RabbitMQ...");
  try {
    const connection: amqp.Connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue("notifications");
    console.log("Connected to RabbitMQ");
  } catch (err) {
    console.error("Failed to connect to RabbitMQ:", err);
  }
};

export const sendToQueue = async (message: string): Promise<void> => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
  channel.sendToQueue("notifications", Buffer.from(message));
};

export const consumeFromQueue = async (
  callback: (message: string) => void
): Promise<void> => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
  channel.consume("notifications", (msg: amqp.Message | null) => {
    if (msg) {
      const message = msg.content.toString();
      callback(message);
      channel.ack(msg);
    }
  });
};
