import express from "express";
import {
  getLogin,
  getRegister,
  loginController,
  logoutController,
  registerController,
  getProfile,
  updateProfile,
  verify,
} from "../controllers/userController.js";
import isLogin from "../middleware/isLogin.js";
import checkUser from "../middleware/checkUser.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.get("/register", isLogin, getRegister);
router.get("/login", isLogin, getLogin);
router.post("/register", isLogin, registerController);
router.post("/login", isLogin, loginController);
router.get("/logout", checkUser, logoutController);

router.get("/profile", checkUser, getProfile);
router.put("/profile", checkUser, upload.single("profile"), updateProfile);
router.put("/verify", checkUser, verify);

export default router;
