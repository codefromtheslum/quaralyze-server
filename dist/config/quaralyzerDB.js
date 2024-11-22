"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quaralyzerDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const baseUrl = process.env.MONGO_STRING;
const quaralyzerDB = () => {
    mongoose_1.default.connect(`${baseUrl}`).then(() => {
        console.log(`Database connection established ❤️❤️❤️...`);
    });
};
exports.quaralyzerDB = quaralyzerDB;
