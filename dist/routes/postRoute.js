"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const postController_1 = require("../controller/postController");
const upload = (0, multer_1.default)().single("image");
const router = (0, express_1.Router)();
router.route("/:userId/create-post").post(upload, postController_1.createPost);
router.route("/:postId/get-post").get(postController_1.getOnePost);
router.route("/:userId/:postId/update-post").patch(upload, postController_1.updatePost);
router.route("/:userId/:postId/delete-post").delete(postController_1.deletePost);
router.route("/get-post").get(postController_1.getAllPost);
router.route("/:postId/:userId/like").post(postController_1.likePost);
router.route("/:postId/:userId/unlike").post(postController_1.unlikePost);
exports.default = router;
