import asyncHandler from "express-async-handler";

const recalculateStatus = (fee) => {
  if (fee.amountPaid <= 0) {
    fee.status = fee.dueDate && fee.dueDate < new Date() ? "overdue" : "pending";
  } else if (fee.amountPaid < fee.amountDue) {
    fee.status = "partial";
  } else {
    fee.status = "paid";
  }
};

// @route GET /api/fees?student=&status=
export const getFees = asyncHandler(async (req, res) => {
  const { Fee } = req.tenantModels;
  const { student, status, academicYear } = req.query;
  const filter = {};
  if (student) filter.student = student;
  if (status) filter.status = status;
  if (academicYear) filter.academicYear = academicYear;

  const fees = await Fee.find(filter).populate("student", "firstName lastName admissionNumber");
  res.json({ success: true, count: fees.length, data: fees });
});

// @route POST /api/fees
export const createFeeRecord = asyncHandler(async (req, res) => {
  const { Fee } = req.tenantModels;
  const fee = await Fee.create(req.body);
  res.status(201).json({ success: true, data: fee });
});

// @route POST /api/fees/:id/pay
export const recordPayment = asyncHandler(async (req, res) => {
  const { Fee } = req.tenantModels;
  const { amount, method } = req.body;
  const fee = await Fee.findById(req.params.id);
  if (!fee) {
    res.status(404);
    throw new Error("Fee record not found");
  }

  fee.payments.push({ amount, method, receivedBy: req.user._id });
  fee.amountPaid += Number(amount);
  recalculateStatus(fee);
  await fee.save();

  res.json({ success: true, data: fee });
});

// @route GET /api/fees/:id
export const getFee = asyncHandler(async (req, res) => {
  const { Fee } = req.tenantModels;
  const fee = await Fee.findById(req.params.id).populate(
    "student",
    "firstName lastName admissionNumber"
  );
  if (!fee) {
    res.status(404);
    throw new Error("Fee record not found");
  }
  res.json({ success: true, data: fee });
});
