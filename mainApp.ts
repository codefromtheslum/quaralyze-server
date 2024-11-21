import { Application, json, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

export const mainApp = (app: Application) => {
  app.use(json());
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "DELETE", "PATCH"],
    })
  );
  app.use(morgan("dev"));
  app.use(helmet());

  app.get("/", (req: Request, res: Response): any => {
    try {
      return res.status(200).json({
        message: "...Quaralyze Server...",
      });
    } catch (error: any) {
      return res.status(400).json({
        message: "Error occured using this route",
        data: error?.message,
      });
    }
  });
};
