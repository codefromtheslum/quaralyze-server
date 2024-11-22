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
exports.deleteAccount = exports.getOneAccount = exports.updateAccountDetails = exports.loginAccount = exports.createAccount = exports.getAllAccount = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const streamifier_1 = require("../config/streamifier");
const getAllAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find().sort({
            createdAt: -1,
        });
        return res.status(200).json({
            message: `${users === null || users === void 0 ? void 0 : users.length} user(s) in the platform`,
            data: users,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.getAllAccount = getAllAccount;
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailAddress, password } = req.body;
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashed = yield bcryptjs_1.default.hash(password, salt);
        const user = yield userModel_1.default.create({ emailAddress, password: hashed });
        return res.status(201).json({
            message: "Account created successfully",
            data: user,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.createAccount = createAccount;
const loginAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailAddress, password } = req.body;
        const user = yield userModel_1.default.findOne({ emailAddress });
        if (!user) {
            return res.status(404).json({
                message: "Account does not exist",
            });
        }
        if (user) {
            const check = yield bcryptjs_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || "");
            if (check) {
                return res.status(200).json({
                    message: "Login successfull",
                    data: user,
                });
            }
            else {
                return res.status(403).json({
                    message: "Incorrect password",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "Account does not exist",
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
exports.loginAccount = loginAccount;
const updateAccountDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { firstName, lastName, userName, facebookURL, instagramURL, twitterURL, linkedinURL, phoneNumber, gender, country, state, occupation, } = req.body;
        const { secure_url, public_url } = yield (0, streamifier_1.streamUpload)(req);
        const user = yield userModel_1.default.findByIdAndUpdate(userId, {
            firstName,
            lastName,
            userName,
            image: secure_url,
            imageId: public_url,
            facebookURL,
            instagramURL,
            twitterURL,
            linkedinURL,
            phoneNumber,
            gender,
            country,
            state,
            occupation,
        }, { new: true });
        return res.status(201).json({
            message: "Account updated successfully",
            data: user,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.updateAccountDetails = updateAccountDetails;
const getOneAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Account not found",
            });
        }
        return res.status(200).json({
            message: "Account gotten successfully",
            data: user,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.getOneAccount = getOneAccount;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield userModel_1.default.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({
                message: "Account not found"
            });
        }
        return res.status(201).json({
            message: "Account deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error === null || error === void 0 ? void 0 : error.message
        });
    }
});
exports.deleteAccount = deleteAccount;
