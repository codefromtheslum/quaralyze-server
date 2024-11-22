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
exports.unlikePost = exports.likePost = exports.getAllPost = exports.deletePost = exports.updatePost = exports.getOnePost = exports.createPost = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const streamifier_1 = require("../config/streamifier");
const postModel_1 = __importDefault(require("../model/postModel"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userId } = req.params;
        const { text } = req.body;
        // Verify if the user exists
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Account not found" });
        }
        // Upload image if provided
        let secure_url = null;
        let public_id = null;
        if (req.file) {
            const uploadResult = yield (0, streamifier_1.streamUpload)(req);
            // Destructure only if uploadResult is not null
            if (uploadResult) {
                secure_url = uploadResult.secure_url;
                public_id = uploadResult.public_id;
            }
        }
        // Create post with or without image
        const post = yield postModel_1.default.create({
            text,
            authorId: userId,
            image: secure_url, // null if no image is uploaded
            imageId: public_id, // null if no image is uploaded
        });
        (_a = user === null || user === void 0 ? void 0 : user.posts) === null || _a === void 0 ? void 0 : _a.push(post === null || post === void 0 ? void 0 : post._id);
        user.save();
        return res.status(201).json({
            message: "Post created successfully",
            data: post,
        });
    }
    catch (error) {
        console.error("Error in createPost:", error); // Debugging log
        return res.status(500).json({
            message: "Internal server error",
            data: error.message,
        });
    }
});
exports.createPost = createPost;
const getOnePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const post = yield postModel_1.default
            .findById(postId)
            .populate("authorId") // Populate the authorId with selected fields
            .populate("comments"); // Populate the comments path
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }
        return res.status(200).json({
            message: "Post retrieved successfully",
            data: post,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.getOnePost = getOnePost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, userId } = req.params;
        const { text } = req.body;
        // Retrieve the post and user
        const post = yield postModel_1.default.findById(postId);
        const user = yield userModel_1.default.findById(userId);
        if (!user || !post) {
            return res.status(404).json({
                message: "Not found",
            });
        }
        // Handle image upload only if provided
        let secure_url = null;
        let public_url = null;
        if (req.file) {
            const uploadResult = yield (0, streamifier_1.streamUpload)(req);
            if (uploadResult) {
                secure_url = uploadResult.secure_url;
                public_url = uploadResult.public_id;
            }
        }
        // Prepare the updated post data
        const updateData = { text };
        // Add image fields if an image is uploaded
        if (secure_url && public_url) {
            updateData.image = secure_url;
            updateData.imageId = public_url;
        }
        // Update the post with the new data
        const updatedPost = yield postModel_1.default.findByIdAndUpdate(postId, updateData, {
            new: true, // To return the updated post
        });
        // Check if the user is the post's author
        if (userId.toString() === post.authorId.toString()) {
            return res.status(200).json({
                message: "Post updated successfully",
                data: updatedPost,
            });
        }
        else {
            return res.status(403).json({
                message: "Action cannot be performed",
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
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, userId } = req.params;
        // Retrieve the post and user
        const post = yield postModel_1.default.findById(postId);
        const user = yield userModel_1.default.findById(userId);
        if (!user || !post) {
            return res.status(404).json({
                message: "Not found",
            });
        }
        // Check if the user is the author of the post
        if (userId.toString() === (post === null || post === void 0 ? void 0 : post.authorId.toString())) {
            // Delete the post from the postModel
            yield postModel_1.default.findByIdAndDelete(postId);
            // Remove the post from the user's posts array
            user.posts = user.posts.filter((postId) => postId.toString() !== postId.toString());
            // Save the updated user document
            yield user.save();
            return res.status(200).json({
                message: "Post deleted successfully",
            });
        }
        else {
            return res.status(403).json({
                message: "Action cannot be performed",
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
exports.deletePost = deletePost;
const getAllPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postModel_1.default.find().populate("likes").populate("comments");
        return res.status(200).json({
            message: `${posts === null || posts === void 0 ? void 0 : posts.length} post(s) gotten`,
            data: posts,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.getAllPost = getAllPost;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, userId } = req.params;
        // Find the post and user by their IDs
        const post = yield postModel_1.default.findById(postId).populate("comments");
        const user = yield userModel_1.default.findById(userId);
        // Check if the user or post doesn't exist
        if (!user || !post) {
            return res.status(404).json({
                message: "Not found",
            });
        }
        // Check if the user has already liked the post
        if (post.likes.includes(userId)) {
            return res.status(400).json({
                message: "You have already liked this post",
            });
        }
        // Add the user's ID to the post's likes array
        post.likes.push(userId);
        yield post.save();
        return res.status(200).json({
            message: "Post liked successfully",
            data: post.likes, // Return the number of likes
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.likePost = likePost;
const unlikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, userId } = req.params;
        // Find the post and user by their IDs
        const post = yield postModel_1.default.findById(postId).populate("");
        const user = yield userModel_1.default.findById(userId);
        // Check if the user or post doesn't exist
        if (!user || !post) {
            return res.status(404).json({
                message: "Not found",
            });
        }
        // Check if the user has not liked the post yet
        if (!post.likes.includes(userId)) {
            return res.status(400).json({
                message: "You have not liked this post",
            });
        }
        // Remove the user's ID from the post's likes array
        post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
        yield post.save();
        return res.status(200).json({
            message: "Post unliked successfully",
            data: post.likes, // Return the number of likes
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.unlikePost = unlikePost;
