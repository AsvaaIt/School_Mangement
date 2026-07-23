import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectMasterDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import schoolRoutes from "./routes/schoolRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();
connectMasterDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5175", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "ASVAA IT School Portal API is running" });
});

app.use("/api/schools", schoolRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
