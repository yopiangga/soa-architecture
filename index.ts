import express, { Application, Response, Request, NextFunction } from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { router as authRouter } from "./routes/authRoutes";
import { router as userRoutes } from "./routes/userRoutes";
import { router as transactionRoutes } from "./routes/transactionRoutes";
import { config } from "./config";
import { jwtAuthMiddleware } from "./middleware/jwtAuth";

dotenv.config();

const app: Application = express();

app.use(helmet());
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/auth", authRouter);
app.use("/user", jwtAuthMiddleware, userRoutes);
app.use("/transaction", jwtAuthMiddleware, transactionRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message,
  });
});

app.listen(config.port, () => {
  console.log("Server is running on port " + config.port);
});
