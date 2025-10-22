import express from "express";
import userCtrl from "./user.controller.js";
const router = express.Router();
router.route("/api/users").post(userCtrl.create);
export default router;
