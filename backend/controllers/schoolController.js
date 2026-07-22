import asyncHandler from "express-async-handler";
import School from "../models/School.js";

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40) || "school";

const randomSuffix = () => Math.floor(1000 + Math.random() * 9000);

// @desc  Create a new school (and, implicitly, its own dedicated database).
//        This is the very first step before anyone can register or log in.
// @route POST /api/schools
export const createSchool = asyncHandler(async (req, res) => {
  const { name, address, contactEmail, contactPhone } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("School name is required");
  }

  const slug = slugify(name);

  // Generate a short, human-shareable school code (e.g. GREENWOOD-4821),
  // retrying on the rare chance of a collision.
  let code;
  let attempts = 0;
  do {
    code = `${slug.slice(0, 10).toUpperCase()}-${randomSuffix()}`;
    attempts += 1;
  } while ((await School.findOne({ code })) && attempts < 5);

  const dbName = `asvaa_school_${slug}_${randomSuffix()}`;

  const school = await School.create({
    name: name.trim(),
    code,
    slug,
    dbName,
    address,
    contactEmail,
    contactPhone,
  });

  // Note: the tenant database itself doesn't need to be explicitly created —
  // MongoDB creates it lazily the moment the first document (e.g. the admin
  // user created in /auth/register) is written to it.

  res.status(201).json({
    success: true,
    data: {
      id: school._id,
      name: school.name,
      code: school.code,
    },
  });
});

// @desc  Look up a school's name by its code, so the login/register pages
//        can confirm "you're signing in to <School Name>" before the user
//        enters their credentials.
// @route GET /api/schools/lookup/:code
export const lookupSchool = asyncHandler(async (req, res) => {
  const code = (req.params.code || "").trim().toUpperCase();
  const school = await School.findOne({ code }).select("name code");

  if (!school) {
    res.status(404);
    throw new Error("No school found for that code");
  }

  res.json({ success: true, data: { name: school.name, code: school.code } });
});
