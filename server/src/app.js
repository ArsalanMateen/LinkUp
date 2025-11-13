import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./modules/users/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import postRoutes from "./modules/posts/post.routes.js";

const app = express();
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", postRoutes);
app.use((err, req, res, next) => {
  if (err)
    res
      .status(err.name === "UnauthorizedError" ? 401 : 400)
      .json({ error: err.message });
  else next();
});
export default app;
