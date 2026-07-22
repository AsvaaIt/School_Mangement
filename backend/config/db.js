import mongoose from "mongoose";
import { buildMongoUri } from "../utils/mongoUri.js";

// The MASTER connection is mongoose's default connection. It only ever
// stores the `School` registry — the list of schools and which database
// each one's data lives in. Individual schools' data (students, teachers,
// attendance, fees, users, etc.) live in their own separate databases,
// connected to on-demand by ../config/tenantManager.js.
const connectMasterDB = async () => {
  try {
    const base = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
    const masterUri = buildMongoUri(base, "asvaa_master");
    console.log(`Connecting to master DB: ${masterUri.replace(/:\/\/[^@]*@/, "://<credentials>@")}`);
    const conn = await mongoose.connect(masterUri);
    console.log(`Master DB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`Master DB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectMasterDB;
