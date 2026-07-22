import express from "express";
import {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getTeachers)
  .post(protect, authorize("admin"), createTeacher);

router
  .route("/:id")
  .get(protect, getTeacher)
  .put(protect, authorize("admin"), updateTeacher)
  .delete(protect, authorize("admin"), deleteTeacher);

export default router;
