import { Request, Response } from "express";
import Notification from "../models/notificationModel";
import { sendToQueue } from "../utils/rabbitmq";

export const createNotification = async (req: Request, res: Response) => {
  const { userId, message } = req.body;

  try {
    // Save notification to MongoDB
    const notification = new Notification({ userId, message });
    await notification.save();

    // Send notification task to RabbitMQ
    await sendToQueue(JSON.stringify({ userId, message }));

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
