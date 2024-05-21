import express from "express";
import checkUser from "../middleware/checkUser.js";
import {
  getAllForum,
  getCreate,
  create,
  like,
  unlike,
  getForum,
  comment,
  editForumPage,
  editForum,
  deleteForum,
  deleteComment,
} from "../controllers/forumController.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.get("/", checkUser, getAllForum);
// router.get("/mostLike", checkUser, getLikeForum);
// router.get("/mostComment", checkUser, getCommentForum);

router.get("/create", checkUser, getCreate);
router.post("/create", checkUser, upload.array("images", 5), create);
router.put("/like", checkUser, like);
router.put("/unlike", checkUser, unlike);
// router.put("/bookmark", checkUser, bookmark);
// router.put("/unbookmark", checkUser, unbookmark);

router.get("/:slug", checkUser, getForum);

router.get("/:forumId/edit", checkUser, editForumPage);
router.put("/:forumId/edit", checkUser, upload.array("images", 5), editForum);
router.delete("/:forumId/delete", checkUser, deleteForum);
router.post("/:forumId/comment", checkUser, comment);
router.delete("/:forumId/comment/:commentId/delete", checkUser, deleteComment);

export default router;
