import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import School from "../models/School.js";
import { getTenantContext } from "../config/tenantManager.js";

// Verifies the JWT, then uses the schoolId encoded in it to look up which
// school this user belongs to and connect to that school's own database.
// Every downstream route handler gets req.user, req.school and
// req.tenantModels already resolved to the correct tenant.
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }

  const school = await School.findById(decoded.schoolId);
  if (!school) {
    res.status(401);
    throw new Error("Not authorized, school not found");
  }

  const { models } = getTenantContext(school.dbName);
  const user = await models.User.findById(decoded.id);

  if (!user || !user.isActive) {
    res.status(401);
    throw new Error("Not authorized, user not found or inactive");
  }

  req.user = user;
  req.school = school;
  req.tenantModels = models;
  next();
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role '${req.user?.role}' is not authorized to access this resource`);
    }
    next();
  };
};
