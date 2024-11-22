"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const userController_1 = require("../controller/userController");
const upload = (0, multer_1.default)().single("image");
const router = (0, express_1.Router)();
router.route("/get-account").get(userController_1.getAllAccount);
router.route("/create-account").post(userController_1.createAccount);
router.route("/login-account").post(userController_1.loginAccount);
router.route("/:userId/update-account").patch(upload, userController_1.updateAccountDetails);
router.route("/:userId/get-account").get(userController_1.getOneAccount);
router.route("/:userId/delete-account").delete(userController_1.deleteAccount);
exports.default = router;
