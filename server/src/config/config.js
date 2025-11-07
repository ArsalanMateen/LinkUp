import dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });
export default {
  jwtSecret: process.env.JWT_SECRET,
  env: process.env.NODE_ENV,
  mongoUri: process.env.LINKUP_DB_URI,
  mongoDbName: process.env.LINKUP_NS,
  port: process.env.PORT,
};
