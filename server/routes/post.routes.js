import express from "express";
import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import postCtrl from "../controllers/post.controller.js";

const router = express.Router();

router.route("/api/posts/public").get(postCtrl.listPublic);

router
  .route("/api/posts/feed/:userId")
  .get(authCtrl.requireSignin, postCtrl.listNewsFeed);

router.route("/api/posts/by/:userId").get(postCtrl.listByUser);

router
  .route("/api/posts/new/:userId")
  .post(authCtrl.requireSignin, postCtrl.create);

router.route("/api/posts/photo/:postId").get(postCtrl.photo);

router.param("userId", userCtrl.userByID);
router.param("postId", postCtrl.postByID);

export default router;
