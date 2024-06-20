import express from "express";
import checkUser from "../middleware/checkUser.js";
import checkRole from "../middleware/checkRole.js";
import {
  getAllArticles,
  getMyArticles,
  getArticle,
  createPage,
  createArticle,
  editPage,
  editArticle,
  deleteArticle,
} from "../controllers/articleController.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.get("/", checkUser, getAllArticles);
router.get("/create", checkUser, checkRole, createPage);
router.get("/myArticle", checkUser, checkRole, getMyArticles);

router.post(
  "/create",
  checkUser,
  checkRole,
  upload.single("image"),
  createArticle
);

router.get("/:slug", checkUser, getArticle);
router.get("/:articleId/edit", checkUser, checkRole, editPage);
router.put(
  "/:articleId/edit",
  checkUser,
  checkRole,
  upload.single("image"),
  editArticle
);
router.delete("/:articleId/delete", checkUser, checkRole, deleteArticle);

export default router;
