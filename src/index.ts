import "./config/otelConfig"
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import reportRouter from "./routes/reportRoute";
import { RedisService } from "ondc-automation-cache-lib";
import { logError, logger, logInfo } from "./utils/logger";

// Initialize dotenv to load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Redis database connection
try {
  RedisService.useDb(2);
} catch (err) {
  logger.error(err);
}

// Middleware setup
app.use(express.json());

// Routes
app.use("/", reportRouter);

// Global error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // logger.error(err.stack);
  logError({
    message: "Internal Server Error",
    error: err,
  });
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(PORT, () => {
  // logger.info(`Server is running on http://localhost:${PORT}`);
  logInfo({
    message: `Server is running on http://localhost:${PORT}`,
    });
});
