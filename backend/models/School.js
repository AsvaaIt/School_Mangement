import mongoose from "mongoose";

// School records live on the MASTER connection (mongoose's default connection).
// Each school also gets its own dedicated database, named `dbName` below,
// where all of its students, teachers, classes, attendance, fees, etc. live.
const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    slug: { type: String, required: true, trim: true },
    dbName: { type: String, required: true, unique: true },
    address: { type: String, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("School", schoolSchema);
