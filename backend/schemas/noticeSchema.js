import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    audience: { type: String, enum: ["all", "students", "teachers", "parents"], default: "all" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default noticeSchema;
