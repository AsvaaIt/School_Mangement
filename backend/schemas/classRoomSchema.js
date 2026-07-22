import mongoose from "mongoose";

const classRoomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    section: { type: String, required: true },
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    subjects: [{ type: String }],
    academicYear: { type: String, required: true },
    capacity: { type: Number, default: 40 },
  },
  { timestamps: true }
);

classRoomSchema.index({ name: 1, section: 1, academicYear: 1 }, { unique: true });

export default classRoomSchema;
