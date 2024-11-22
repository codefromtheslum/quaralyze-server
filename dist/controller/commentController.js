"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeComment = exports.likeComment = exports.deleteComment = exports.createComment = void 0;
const postModel_1 = __importDefault(require("../model/postModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const commentModel_1 = __importDefault(require("../model/commentModel"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, userId } = req.params;
        const { text } = req.body;
        const post = yield postModel_1.default.findById(postId).populate("");
        const user = yield userModel_1.default.findById(userId).populate("");
        // Check if the user and post exist
        if (!user || !post) {
            return res.status(404).json({
                message: "User or Post not found",
            });
        }
        // Prevent the post creator from commenting on their own post
        if (userId.toString() === post.authorId.toString()) {
            return res.status(403).json({
                message: "You cannot comment on your own post",
            });
        }
        // Create the comment and associate it with the post
        const comment = yield commentModel_1.default.create({ text, authorId: userId });
        post === null || post === void 0 ? void 0 : post.comments.push(comment === null || comment === void 0 ? void 0 : comment._id);
        yield post.save();
        return res.status(201).json({
            message: "Comment added successfully",
            data: comment,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.createComment = createComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, userId, commentId } = req.params;
        // Find the post, user, and comment
        const post = yield postModel_1.default.findById(postId);
        const user = yield userModel_1.default.findById(userId);
        const comment = yield commentModel_1.default.findById(commentId);
        // Check if the post, user, or comment exists
        if (!post || !user || !comment) {
            return res.status(404).json({
                message: "Not found",
            });
        }
        // Check if the user is the comment author or the post author
        if (userId.toString() === (comment === null || comment === void 0 ? void 0 : comment.authorId.toString()) ||
            userId.toString() === (post === null || post === void 0 ? void 0 : post.authorId.toString())) {
            // Remove the comment from the post's comments array
            post.comments = post.comments.filter((comments) => comments.toString() !== commentId.toString());
            // Save the updated post
            yield post.save();
            // Delete the comment from the comment model
            yield commentModel_1.default.findByIdAndDelete(commentId);
            return res.status(200).json({
                message: "Comment deleted successfully",
            });
        }
        else {
            return res.status(403).json({
                message: "You are not authorized to delete this comment",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.deleteComment = deleteComment;
const likeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId, userId } = req.params;
        // Find the comment and user by their IDs
        const comment = yield commentModel_1.default.findById(commentId).populate("authorId");
        const user = yield userModel_1.default.findById(userId);
        // Check if the user or comment doesn't exist
        if (!user || !comment) {
            return res.status(404).json({
                message: "Not found",
            });
        }
        // Check if the user has already liked the comment
        if (comment.likes.includes(userId)) {
            return res.status(400).json({
                message: "You have already liked this comment",
            });
        }
        // Add the user's ID to the comment's likes array
        comment.likes.push(userId);
        yield comment.save();
        return res.status(200).json({
            message: "Comment liked successfully",
            data: comment.likes,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.likeComment = likeComment;
const unlikeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId, userId } = req.params;
        // Find the comment and user by their IDs
        const comment = yield commentModel_1.default.findById(commentId).populate("authorId");
        const user = yield userModel_1.default.findById(userId);
        // Check if the user or comment doesn't exist
        if (!user || !comment) {
            return res.status(404).json({
                message: "Not found",
            });
        }
        // Remove the user's ID from the comment's likes array
        comment.likes = comment.likes.filter((id) => id.toString() !== userId);
        yield comment.save();
        return res.status(200).json({
            message: "Comment unliked successfully",
            data: comment.likes,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.unlikeComment = unlikeComment;
