import express from "express";
import {
  getFees,
  getFee,
  createFeeRecord,
  recordPayment,
} from "../controllers/feeController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getFees)
  .post(protect, authorize("admin"), createFeeRecord);

router.get("/:id", protect, getFee);
router.post("/:id/pay", protect, authorize("admin"), recordPayment);

export default router;
