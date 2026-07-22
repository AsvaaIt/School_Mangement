import express from "express";
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../controllers/noticeController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getNotices)
  .post(protect, authorize("admin", "teacher"), createNotice);

router
  .route("/:id")
  .put(protect, authorize("admin", "teacher"), updateNotice)
  .delete(protect, authorize("admin"), deleteNotice);

export default router;
