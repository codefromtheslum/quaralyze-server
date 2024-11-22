"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentController_1 = require("../controller/commentController");
const router = (0, express_1.Router)();
router.route("/:postId/:userId/create-comment").post(commentController_1.createComment);
router
    .route("/:postId/:userId/:commentId/delete-comment")
    .delete(commentController_1.deleteComment);
router.route("/:commentId/:userId/like").post(commentController_1.likeComment);
router.route("/:commentId/:userId/unlike").post(commentController_1.unlikeComment);
exports.default = router;
