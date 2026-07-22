import asyncHandler from "express-async-handler";

// @desc Mark attendance for one or many students (bulk)
// @route POST /api/attendance
export const markAttendance = asyncHandler(async (req, res) => {
  const { Attendance } = req.tenantModels;
  const { records } = req.body;

  if (!Array.isArray(records) || records.length === 0) {
    res.status(400);
    throw new Error("Provide an array of attendance records");
  }

  const results = [];
  for (const record of records) {
    const doc = await Attendance.findOneAndUpdate(
      { student: record.student, date: record.date },
      { ...record, markedBy: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );
    results.push(doc);
  }

  res.status(201).json({ success: true, count: results.length, data: results });
});

// @route GET /api/attendance?classRoom=&date=&student=
export const getAttendance = asyncHandler(async (req, res) => {
  const { Attendance } = req.tenantModels;
  const { classRoom, date, student, from, to } = req.query;
  const filter = {};
  if (classRoom) filter.classRoom = classRoom;
  if (student) filter.student = student;
  if (date) filter.date = new Date(date);
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const attendance = await Attendance.find(filter)
    .populate("student", "firstName lastName admissionNumber")
    .populate("classRoom", "name section")
    .sort({ date: -1 });

  res.json({ success: true, count: attendance.length, data: attendance });
});

// @route GET /api/attendance/summary/:studentId
export const getStudentAttendanceSummary = asyncHandler(async (req, res) => {
  const { Attendance } = req.tenantModels;
  const records = await Attendance.find({ student: req.params.studentId });
  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;
  const excused = records.filter((r) => r.status === "excused").length;
  const percentage = total ? ((present / total) * 100).toFixed(2) : "0.00";

  res.json({
    success: true,
    data: { total, present, absent, late, excused, attendancePercentage: percentage },
  });
});
