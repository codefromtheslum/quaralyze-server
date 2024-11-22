"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const replyModel = new mongoose_1.Schema({
    authorId: { type: mongoose_1.Types.ObjectId, ref: "users" },
    text: { type: String, required: true },
    likes: [
        {
            types: mongoose_1.Types.ObjectId,
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("replies", replyModel);
