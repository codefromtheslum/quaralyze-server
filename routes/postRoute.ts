import { Router } from "express";
import multer from "multer";
import {
  createPost,
  getOnePost,
  updatePost,
  deletePost,
  getAllPost,
  likePost,
  unlikePost,
} from "../controller/postController";

const upload = multer().single("image");

const router = Router();
router.route("/:userId/create-post").post(upload, createPost);
router.route("/:postId/get-post").get(getOnePost);
router.route("/:userId/:postId/update-post").patch(upload, updatePost);
router.route("/:userId/:postId/delete-post").delete(deletePost);
router.route("/get-post").get(getAllPost);
router.route("/:postId/:userId/like").post(likePost);
router.route("/:postId/:userId/unlike").post(unlikePost);

export default router;
