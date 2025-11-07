import express from "express";
import userCtrl from "./user.controller.js";
const router = express.Router();
router.route("/api/users").post(userCtrl.create);
router.route("/api/users/:uId").get(userCtrl.read);
router.param("uId", userCtrl.userByID);
export default router;
