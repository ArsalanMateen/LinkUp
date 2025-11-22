import config from "./config/config.js";
import app from "./express.js";
import mongoose from "mongoose";

mongoose.Promise = global.Promise;

try {
  await mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    ...(config.mongoDbName ? { dbName: config.mongoDbName } : {}),
  });
  app.listen(config.port, () => {
    console.info("Database connected. Server started on port %s.", config.port);
  });
} catch (error) {
  console.error("Server startup failed: unable to connect to MongoDB.");
  process.exitCode = 1;
}
