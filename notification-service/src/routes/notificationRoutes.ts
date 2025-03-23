import express from "express";
import { createNotification } from "../controllers/notificationController";

const router = express.Router();

router.post("/", createNotification);

export default router;
