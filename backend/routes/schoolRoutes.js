import express from "express";
import { createSchool, lookupSchool } from "../controllers/schoolController.js";

const router = express.Router();

router.post("/", createSchool);
router.get("/lookup/:code", lookupSchool);

export default router;
