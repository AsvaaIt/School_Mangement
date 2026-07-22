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
