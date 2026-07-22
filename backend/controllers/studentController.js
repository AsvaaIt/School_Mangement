import asyncHandler from "express-async-handler";

// @route GET /api/students
export const getStudents = asyncHandler(async (req, res) => {
  const { Student } = req.tenantModels;
  const { classRoom, status, search } = req.query;
  const filter = {};
  if (classRoom) filter.classRoom = classRoom;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { admissionNumber: { $regex: search, $options: "i" } },
    ];
  }
  const students = await Student.find(filter).populate("classRoom", "name section");
  res.json({ success: true, count: students.length, data: students });
});

// @route GET /api/students/:id
export const getStudent = asyncHandler(async (req, res) => {
  const { Student } = req.tenantModels;
  const student = await Student.findById(req.params.id).populate("classRoom", "name section");
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  res.json({ success: true, data: student });
});

// @route POST /api/students
export const createStudent = asyncHandler(async (req, res) => {
  const { Student } = req.tenantModels;
  const student = await Student.create(req.body);
  res.status(201).json({ success: true, data: student });
});

// @route PUT /api/students/:id
export const updateStudent = asyncHandler(async (req, res) => {
  const { Student } = req.tenantModels;
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  res.json({ success: true, data: student });
});

// @route DELETE /api/students/:id
export const deleteStudent = asyncHandler(async (req, res) => {
  const { Student } = req.tenantModels;
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  res.json({ success: true, data: {} });
});
