import { Router } from "express";
import {
  handleChatbotMessage,
  handleChatbotHealth,
} from "../controllers/chatbot.controller.mjs";

const router = Router();

router.post("/api/chatbot/message", handleChatbotMessage);
router.get("/api/chatbot/health", handleChatbotHealth);

export default router;

