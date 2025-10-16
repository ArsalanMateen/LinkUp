import dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });
export default { env: process.env.NODE_ENV, port: process.env.PORT };
