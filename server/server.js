import config from "./config/config.js";
import app from "./express.js";
import mongoose from "mongoose";

mongoose.Promise = global.Promise;
mongoose.connection.on("error", () => {
  console.error(
    "Database connection failed. Check MongoDB connectivity and LINKUP_DB_URI.",
  );
});

try {
  await mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    ...(config.mongoDbName ? { dbName: config.mongoDbName } : {}),
  });
  app.listen(config.port, () => {
    console.info("Database connected. Server started on port %s.", config.port);
  });
} catch {
  // Connection strings can contain credentials; never include them in logs.
  console.error("Server startup failed: unable to connect to MongoDB.");
  await mongoose.disconnect();
  process.exitCode = 1;
}
