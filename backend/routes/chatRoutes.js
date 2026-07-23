import express from "express";
import { publicChat, staffChat } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";
import { resolveSchoolPublicByCode } from "../middleware/tenant.js";

const router = express.Router();

router.post("/public", resolveSchoolPublicByCode, publicChat);
router.post("/staff", protect, staffChat);

export default router;
