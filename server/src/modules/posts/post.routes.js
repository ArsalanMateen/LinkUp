import express from "express";
import postCtrl from "./post.controller.js";
import authCtrl from "../auth/auth.controller.js";
import userCtrl from "../users/user.controller.js";
const router = express.Router();
router.route("/api/posts/public").get(postCtrl.listPublic);
router.route("/api/posts/by/:userId").get(postCtrl.listByUser);
router
  .route("/api/posts/new/:userId")
  .post(authCtrl.requireSignin, postCtrl.create);
router.param("userId", userCtrl.userByID);
export default router;
