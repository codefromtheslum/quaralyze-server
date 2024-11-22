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
exports.unlikeReply = exports.likeReply = exports.deleteReply = exports.createReply = void 0;
const commentModel_1 = __importDefault(require("../model/commentModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const replyModel_1 = __importDefault(require("../model/replyModel"));
const createReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId, userId } = req.params;
        const { text } = req.body;
        // Find the comment and user
        const comment = yield commentModel_1.default.findById(commentId);
        const user = yield userModel_1.default.findById(userId);
        // Check if comment or user exists
        if (!user || !comment) {
            return res.status(404).json({
                message: "Not found",
            });
        }
        // Create the reply
        const reply = yield replyModel_1.default.create({ text, authorId: userId });
        // Push the reply's _id into the comment's replies array
        comment.replies.push(reply._id); // Store the reply ID, not the user ID
        yield comment.save();
        return res.status(201).json({
            message: "Reply sent",
            data: reply,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.createReply = createReply;
const deleteReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, replyId, commentId } = req.params;
        // Find the user, reply, and the comment to which the reply belongs
        const user = yield userModel_1.default.findById(userId);
        const reply = yield replyModel_1.default.findById(replyId);
        if (!user || !reply) {
            return res.status(404).json({
                message: "Not found",
            });
        }
        // Find the comment that the reply is associated with
        const comment = yield commentModel_1.default.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }
        // Check if the user is the author of the reply
        if (userId.toString() === reply.authorId.toString()) {
            // Remove the reply's ID from the comment's replies array
            comment.replies = comment.replies.filter((replyId) => replyId.toString() !== replyId.toString());
            yield comment.save();
            // Delete the reply
            yield replyModel_1.default.findByIdAndDelete(replyId);
            return res.status(200).json({
                message: "Reply deleted successfully",
            });
        }
        else {
            return res.status(403).json({
                message: "Not authorized",
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
exports.deleteReply = deleteReply;
const likeReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, replyId } = req.params;
        const user = yield userModel_1.default.findById(userId);
        const reply = yield replyModel_1.default.findById(replyId);
        if (!user || !reply) {
            return res.status(404).json({
                message: "Not found",
            });
        }
        // Check if the user has already liked the reply
        if (reply.likes.includes(userId)) {
            return res.status(400).json({
                message: "You have already liked this reply",
            });
        }
        // Add user to the likes array and save the reply
        reply.likes.push(user === null || user === void 0 ? void 0 : user._id);
        yield reply.save();
        return res.status(200).json({
            message: "Reply liked successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.likeReply = likeReply;
const unlikeReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, replyId } = req.params;
        const user = yield userModel_1.default.findById(userId);
        const reply = yield replyModel_1.default.findById(replyId);
        if (!user || !reply) {
            return res.status(404).json({
                message: "Not found",
            });
        }
        // Remove the user from the likes array if they exist
        reply.likes = reply.likes.filter((like) => like.toString() !== userId.toString());
        yield reply.save();
        return res.status(200).json({
            message: "Reply unliked successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.unlikeReply = unlikeReply;
