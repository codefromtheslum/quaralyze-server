import express from "express";
import { mainApp } from "./mainApp";
import { quaralyzerDB } from "./config/quaralyzerDB";
import env from "dotenv";
env.config();

const port: any = `${parseInt(process.env.PORT!)}`
const app = express();

mainApp(app);
const server = app.listen(port, () => {
 quaralyzerDB();
});

process.on("uncaughtException", (error: any) => {
  console.log(`Server is shutting down due to an uncaught exception` + error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.log(`Server is shutting down due to an unhandled rejection` + reason);
  server.close(() => {
    process.exit(1);
  });
});
