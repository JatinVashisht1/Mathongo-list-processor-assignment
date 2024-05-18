import express from "express";
import listRouter from "./routes/list-router.js";
import { HTTPStatusCodes } from "./utils/http-status-codes.js";
const app = express();

app.use(express.json());
app.use("/list", listRouter);

/**
 * Error handler for any un-handled error.
 *
 * @type { express.ErrorRequestHandler }
 */
const expressErrorHandler = (error, req, res, next) => {
  console.error(error);

  const statusCode = error.status ?? 500;
  const errorMessage = error.message ?? "Something went wrong.";

  return res.status(statusCode).json({ success: false, message: errorMessage });
};

app.use(expressErrorHandler);

export default app;
