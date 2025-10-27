import express from "express";
import userCtrl from "../controllers/user.controller.js";

const router = express.Router();

router.route("/api/users").get(userCtrl.list).post(userCtrl.create);

export default router;
