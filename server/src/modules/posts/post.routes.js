import express from "express";
import postCtrl from "./post.controller.js";
import authCtrl from "../auth/auth.controller.js";
import userCtrl from "../users/user.controller.js";
const router = express.Router();
router.route("/api/posts/public").get(postCtrl.listPublic);
router.route("/api/posts/:postId/comments").get(postCtrl.listComments);
router
  .route("/api/posts/feed/:userId")
  .get(authCtrl.requireSignin, postCtrl.listNewsFeed);
router.route("/api/posts/by/:userId").get(postCtrl.listByUser);
router
  .route("/api/posts/new/:userId")
  .post(authCtrl.requireSignin, postCtrl.create);
router
  .route("/api/posts/comment")
  .put(authCtrl.requireSignin, postCtrl.comment);
router
  .route("/api/posts/uncomment")
  .put(authCtrl.requireSignin, postCtrl.uncomment);
router.param("userId", userCtrl.userByID);
export default router;
