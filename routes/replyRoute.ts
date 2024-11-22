import { Router } from "express";
import {
  createReply,
  deleteReply,
  likeReply,
  unlikeReply,
} from "../controller/replyController";

const router = Router();
router.route("/:userId/:commentId").post(createReply);
router.route("/:userId/:commentId/:userId/delete-reply").delete(deleteReply);
router.route("/:replyId/:userId/like").post(likeReply);
router.route("/:replyId/:userId/unlike").post(unlikeReply);
export default router;