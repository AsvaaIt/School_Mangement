import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    admissionNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    classRoom: { type: mongoose.Schema.Types.ObjectId, ref: "ClassRoom" },
    rollNumber: { type: String },
    guardianName: { type: String },
    guardianPhone: { type: String },
    guardianEmail: { type: String },
    address: { type: String },
    admissionDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "inactive", "graduated"], default: "active" },
  },
  { timestamps: true }
);

export default studentSchema;
