"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentModel = new mongoose_1.Schema({
    authorId: { type: mongoose_1.Types.ObjectId, ref: "users" },
    text: { type: String, required: true },
    likes: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "likes",
        },
    ],
    replies: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "replies",
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("comments", commentModel);
