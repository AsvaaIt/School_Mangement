import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const generateToken = (userId, schoolId) => {
  return jwt.sign({ id: userId, schoolId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc  Register a new user within a specific school (identified by
//        req.body.schoolCode, already resolved onto req.school /
//        req.tenantModels by the resolveSchoolByCode middleware).
// @route POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const { User } = req.tenantModels;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("A user with this email already exists at this school");
  }

  const user = await User.create({ name, email, password, role, phone });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      school: { id: req.school._id, name: req.school.name, code: req.school.code },
      token: generateToken(user._id, req.school._id),
    },
  });
});

// @desc  Login a user within a specific school
// @route POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { User } = req.tenantModels;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("This account has been deactivated. Contact the school admin.");
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      school: { id: req.school._id, name: req.school.name, code: req.school.code },
      token: generateToken(user._id, req.school._id),
    },
  });
});

// @desc  Get logged-in user's profile
// @route GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { ...req.user.toObject(), school: { id: req.school._id, name: req.school.name, code: req.school.code } },
  });
});
