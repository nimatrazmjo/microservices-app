import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: string;
  message: string;
  status: "pending" | "sent" | "failed";
}

const notificationSchema = new Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending",
  },
});

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
