import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    subjectSpecialization: [{ type: String }],
    qualification: { type: String },
    joiningDate: { type: Date, default: Date.now },
    phone: { type: String },
    address: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default teacherSchema;
