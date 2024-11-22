"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postModel = new mongoose_1.Schema({
    image: { type: String },
    imageId: { type: String },
    authorId: { type: mongoose_1.Types.ObjectId, ref: "users", required: true },
    text: { type: String },
    likes: [
        {
            type: mongoose_1.Types.ObjectId,
        },
    ],
    comments: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "comments",
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("posts", postModel);
