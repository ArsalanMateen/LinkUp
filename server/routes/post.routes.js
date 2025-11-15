import express from "express";
import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import postCtrl from "../controllers/post.controller.js";

const router = express.Router();

router
  .route("/api/posts/new/:userId")
  .post(authCtrl.requireSignin, postCtrl.create);

router.param("userId", userCtrl.userByID);

export default router;
