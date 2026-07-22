import express from "express";
import {
  markAttendance,
  getAttendance,
  getStudentAttendanceSummary,
} from "../controllers/attendanceController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, authorize("admin", "teacher"), markAttendance);
router.get("/", protect, getAttendance);
router.get("/summary/:studentId", protect, getStudentAttendanceSummary);

export default router;
