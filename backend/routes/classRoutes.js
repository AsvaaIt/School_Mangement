import express from "express";
import {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
} from "../controllers/classController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getClasses)
  .post(protect, authorize("admin"), createClass);

router
  .route("/:id")
  .get(protect, getClass)
  .put(protect, authorize("admin"), updateClass)
  .delete(protect, authorize("admin"), deleteClass);

export default router;
