import express from "express";
import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getStudents)
  .post(protect, authorize("admin", "teacher"), createStudent);

router
  .route("/:id")
  .get(protect, getStudent)
  .put(protect, authorize("admin", "teacher"), updateStudent)
  .delete(protect, authorize("admin"), deleteStudent);

export default router;
