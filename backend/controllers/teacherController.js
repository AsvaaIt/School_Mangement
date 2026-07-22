import asyncHandler from "express-async-handler";

export const getTeachers = asyncHandler(async (req, res) => {
  const { Teacher } = req.tenantModels;
  const { search, status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { employeeId: { $regex: search, $options: "i" } },
    ];
  }
  const teachers = await Teacher.find(filter);
  res.json({ success: true, count: teachers.length, data: teachers });
});

export const getTeacher = asyncHandler(async (req, res) => {
  const { Teacher } = req.tenantModels;
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }
  res.json({ success: true, data: teacher });
});

export const createTeacher = asyncHandler(async (req, res) => {
  const { Teacher } = req.tenantModels;
  const teacher = await Teacher.create(req.body);
  res.status(201).json({ success: true, data: teacher });
});

export const updateTeacher = asyncHandler(async (req, res) => {
  const { Teacher } = req.tenantModels;
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }
  res.json({ success: true, data: teacher });
});

export const deleteTeacher = asyncHandler(async (req, res) => {
  const { Teacher } = req.tenantModels;
  const teacher = await Teacher.findByIdAndDelete(req.params.id);
  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }
  res.json({ success: true, data: {} });
});
