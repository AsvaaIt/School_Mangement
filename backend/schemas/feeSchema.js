import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    academicYear: { type: String, required: true },
    term: { type: String, required: true },
    amountDue: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    dueDate: { type: Date },
    status: { type: String, enum: ["pending", "partial", "paid", "overdue"], default: "pending" },
    payments: [
      {
        amount: Number,
        paidOn: { type: Date, default: Date.now },
        method: { type: String, enum: ["cash", "card", "bank_transfer", "online"], default: "cash" },
        receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

export default feeSchema;
