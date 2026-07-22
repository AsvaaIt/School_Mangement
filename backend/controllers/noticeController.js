import asyncHandler from "express-async-handler";

export const getNotices = asyncHandler(async (req, res) => {
  const { Notice } = req.tenantModels;
  const notices = await Notice.find()
    .populate("postedBy", "name role")
    .sort({ pinned: -1, createdAt: -1 });
  res.json({ success: true, count: notices.length, data: notices });
});

export const createNotice = asyncHandler(async (req, res) => {
  const { Notice } = req.tenantModels;
  const notice = await Notice.create({ ...req.body, postedBy: req.user._id });
  res.status(201).json({ success: true, data: notice });
});

export const updateNotice = asyncHandler(async (req, res) => {
  const { Notice } = req.tenantModels;
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!notice) {
    res.status(404);
    throw new Error("Notice not found");
  }
  res.json({ success: true, data: notice });
});

export const deleteNotice = asyncHandler(async (req, res) => {
  const { Notice } = req.tenantModels;
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) {
    res.status(404);
    throw new Error("Notice not found");
  }
  res.json({ success: true, data: {} });
});
