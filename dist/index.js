"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mainApp_1 = require("./mainApp");
const quaralyzerDB_1 = require("./config/quaralyzerDB");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = `${parseInt(process.env.PORT)}`;
const app = (0, express_1.default)();
(0, mainApp_1.mainApp)(app);
const server = app.listen(port, () => {
    (0, quaralyzerDB_1.quaralyzerDB)();
});
process.on("uncaughtException", (error) => {
    console.log(`Server is shutting down due to an uncaught exception` + error);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.log(`Server is shutting down due to an unhandled rejection` + reason);
    server.close(() => {
        process.exit(1);
    });
});
