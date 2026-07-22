import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { resolveSchoolByCode } from "../middleware/tenant.js";

const router = express.Router();

router.post("/register", resolveSchoolByCode, register);
router.post("/login", resolveSchoolByCode, login);
router.get("/me", protect, getMe);

export default router;
