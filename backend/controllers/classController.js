import asyncHandler from "express-async-handler";

export const getClasses = asyncHandler(async (req, res) => {
  const { ClassRoom } = req.tenantModels;
  const classes = await ClassRoom.find().populate("classTeacher", "firstName lastName");
  res.json({ success: true, count: classes.length, data: classes });
});

export const getClass = asyncHandler(async (req, res) => {
  const { ClassRoom } = req.tenantModels;
  const classRoom = await ClassRoom.findById(req.params.id).populate(
    "classTeacher",
    "firstName lastName"
  );
  if (!classRoom) {
    res.status(404);
    throw new Error("Class not found");
  }
  res.json({ success: true, data: classRoom });
});

export const createClass = asyncHandler(async (req, res) => {
  const { ClassRoom } = req.tenantModels;
  const classRoom = await ClassRoom.create(req.body);
  res.status(201).json({ success: true, data: classRoom });
});

export const updateClass = asyncHandler(async (req, res) => {
  const { ClassRoom } = req.tenantModels;
  const classRoom = await ClassRoom.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!classRoom) {
    res.status(404);
    throw new Error("Class not found");
  }
  res.json({ success: true, data: classRoom });
});

export const deleteClass = asyncHandler(async (req, res) => {
  const { ClassRoom } = req.tenantModels;
  const classRoom = await ClassRoom.findByIdAndDelete(req.params.id);
  if (!classRoom) {
    res.status(404);
    throw new Error("Class not found");
  }
  res.json({ success: true, data: {} });
});
