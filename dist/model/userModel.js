"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userModel = new mongoose_1.Schema({
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String },
    emailAddress: { type: String, required: true },
    facebookURL: { type: String },
    instagramURL: { type: String },
    twitterURL: { type: String },
    linkedinURL: { type: String },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    gender: { type: String },
    country: { type: String },
    state: { type: String },
    occupation: { type: String },
    posts: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "posts",
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("users", userModel);
