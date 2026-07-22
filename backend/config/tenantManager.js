import mongoose from "mongoose";
import { buildMongoUri } from "../utils/mongoUri.js";
import userSchema from "../schemas/userSchema.js";
import studentSchema from "../schemas/studentSchema.js";
import teacherSchema from "../schemas/teacherSchema.js";
import classRoomSchema from "../schemas/classRoomSchema.js";
import attendanceSchema from "../schemas/attendanceSchema.js";
import feeSchema from "../schemas/feeSchema.js";
import noticeSchema from "../schemas/noticeSchema.js";

// One dedicated Mongo connection per school database, cached so repeated
// requests for the same school reuse the same open connection instead of
// opening a new one every time.
const connectionCache = new Map();

const getTenantConnection = (dbName) => {
  if (connectionCache.has(dbName)) {
    return connectionCache.get(dbName);
  }

  const base = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
  const uri = buildMongoUri(base, dbName);
  console.log(`Opening tenant DB connection: ${uri.replace(/:\/\/[^@]*@/, "://<credentials>@")}`);
  const connection = mongoose.createConnection(uri);
  connectionCache.set(dbName, connection);
  return connection;
};

// Compiles (or reuses already-compiled) models bound to a specific tenant
// connection, so `req.tenantModels.Student` etc. always operate on the
// correct school's database.
const getTenantModels = (connection) => {
  return {
    User: connection.models.User || connection.model("User", userSchema),
    Student: connection.models.Student || connection.model("Student", studentSchema),
    Teacher: connection.models.Teacher || connection.model("Teacher", teacherSchema),
    ClassRoom: connection.models.ClassRoom || connection.model("ClassRoom", classRoomSchema),
    Attendance: connection.models.Attendance || connection.model("Attendance", attendanceSchema),
    Fee: connection.models.Fee || connection.model("Fee", feeSchema),
    Notice: connection.models.Notice || connection.model("Notice", noticeSchema),
  };
};

export const getTenantContext = (dbName) => {
  const connection = getTenantConnection(dbName);
  const models = getTenantModels(connection);
  return { connection, models };
};
