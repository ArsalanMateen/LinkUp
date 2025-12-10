import express from "express";
import userCtrl from "../users/user.controller.js";
import authCtrl from "../auth/auth.controller.js";
import postCtrl from "./post.controller.js";

const router = express.Router();

router.route("/api/posts/public").get(postCtrl.listPublic);

// Use postId so the comments reader bypasses the deletion route's pId loader.
router.route("/api/posts/:postId/comments").get(postCtrl.listComments);

router
  .route("/api/posts/feed/:userId")
  .get(authCtrl.requireSignin, postCtrl.listNewsFeed);

router.route("/api/posts/by/:userId").get(postCtrl.listByUser);

router
  .route("/api/posts/new/:userId")
  .post(authCtrl.requireSignin, postCtrl.create);

router.route("/api/posts/photo/:postId").get(postCtrl.photo);

router.route("/api/posts/like").put(authCtrl.requireSignin, postCtrl.like);
router.route("/api/posts/unlike").put(authCtrl.requireSignin, postCtrl.unlike);

router
  .route("/api/posts/comment")
  .put(authCtrl.requireSignin, postCtrl.comment);
router
  .route("/api/posts/uncomment")
  .put(authCtrl.requireSignin, postCtrl.uncomment);

router
  .route("/api/posts/:pId")
  .delete(authCtrl.requireSignin, postCtrl.isPoster, postCtrl.remove);

router.param("userId", userCtrl.userByID);
router.param("pId", postCtrl.postByID);

export default router;
