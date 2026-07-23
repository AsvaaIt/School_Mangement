import asyncHandler from "express-async-handler";
import School from "../models/School.js";
import { getTenantContext } from "../config/tenantManager.js";

// Used on public auth routes (register/login) where the caller identifies
// their school explicitly by its short school code, since there's no JWT
// yet to read a schoolId from.
export const resolveSchoolByCode = asyncHandler(async (req, res, next) => {
  const schoolCode = (req.body.schoolCode || "").trim().toUpperCase();

  if (!schoolCode) {
    res.status(400);
    throw new Error("School code is required");
  }

  const school = await School.findOne({ code: schoolCode });
  if (!school) {
    res.status(404);
    throw new Error("No school found for that school code. Double-check the code and try again.");
  }

  req.school = school;
  req.tenantModels = getTenantContext(school.dbName).models;
  next();
});

// Lighter-weight variant for public, read-only endpoints (like the public
// FAQ chatbot) that only need basic school info — no tenant DB connection
// is opened, since no student/staff data needs to be touched.
export const resolveSchoolPublicByCode = asyncHandler(async (req, res, next) => {
  const schoolCode = (req.body.schoolCode || "").trim().toUpperCase();

  if (!schoolCode) {
    res.status(400);
    throw new Error("School code is required");
  }

  const school = await School.findOne({ code: schoolCode }).select(
    "name code address contactEmail contactPhone"
  );
  if (!school) {
    res.status(404);
    throw new Error("No school found for that school code. Double-check the code and try again.");
  }

  req.school = school;
  next();
});
