"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const postRoute_1 = __importDefault(require("./routes/postRoute"));
const commentRoute_1 = __importDefault(require("./routes/commentRoute"));
const replyRoute_1 = __importDefault(require("./routes/replyRoute"));
const mainApp = (app) => {
    app.use((0, express_1.json)());
    app.use((0, cors_1.default)({
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PATCH"],
    }));
    app.use((0, morgan_1.default)("dev"));
    app.use((0, helmet_1.default)());
    app.get("/", (req, res) => {
        try {
            return res.status(200).json({
                message: "...Quaralyze Server...",
            });
        }
        catch (error) {
            return res.status(400).json({
                message: "Error occured using this route",
                data: error === null || error === void 0 ? void 0 : error.message,
            });
        }
    });
    app.use("/user", userRoute_1.default);
    app.use("/post", postRoute_1.default);
    app.use("/comment", commentRoute_1.default);
    app.use("/reply", replyRoute_1.default);
};
exports.mainApp = mainApp;
