"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = void 0;
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const rabbitmq_1 = require("../utils/rabbitmq");
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, message } = req.body;
    try {
        // Save notification to MongoDB
        const notification = new notificationModel_1.default({ userId, message });
        yield notification.save();
        // Send notification task to RabbitMQ
        yield (0, rabbitmq_1.sendToQueue)(JSON.stringify({ userId, message }));
        res.status(201).json(notification);
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.createNotification = createNotification;
