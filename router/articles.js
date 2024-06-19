import express from "express";
import checkUser from "../middleware/checkUser.js";
import checkRole from "../middleware/checkRole.js";
import {
  getAllArticles,
  getMyArticles,
  createPage,
} from "../controllers/articleController.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.get("/", checkUser, getAllArticles);
router.get("/create", checkUser, checkRole, createPage);
router.get("/myArticle", checkUser, checkRole, getMyArticles);

export default router;
