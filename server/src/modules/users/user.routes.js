import express from "express";
import userCtrl from "./user.controller.js";
import authCtrl from "../auth/auth.controller.js";
const router = express.Router();
router.route("/api/users").get(userCtrl.list).post(userCtrl.create);
router
  .route("/api/users/follow")
  .put(authCtrl.requireSignin, userCtrl.addFollowing, userCtrl.addFollower);
router.route("/api/users/:uId").get(authCtrl.optionalSignin, userCtrl.read);
router.param("uId", userCtrl.userByID);
export default router;
