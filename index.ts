import express from "express";
import { mainApp } from "./mainApp";

const port: number = 2345;
const app = express();

mainApp(app);
const server = app.listen(port, () => {
  console.log("Server is live and listening on port:", port);
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
