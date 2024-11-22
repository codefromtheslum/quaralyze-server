import { Router } from "express";
import {
  createComment,
  deleteComment,
  likeComment,
  unlikeComment,
} from "../controller/commentController";

const router = Router();
router.route("/:postId/:userId/create-comment").post(createComment);
router
  .route("/:postId/:userId/:commentId/delete-comment")
  .delete(deleteComment);
router.route("/:commentId/:userId/like").post(likeComment);
router.route("/:commentId/:userId/unlike").post(unlikeComment);
export default router;
