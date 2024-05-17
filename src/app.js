import express from "express";
import { ErrorRequestHandler } from "express";
import listRouter from "./routes/list-router";
import { HTTPStatusCodes } from "./utils/http-status-codes";
const app = express();

app.use("/list", listRouter);

/**
 * Error handler for any un-handled error.
 *
 * @type { ErrorRequestHandler }
 */
const expressErrorHandler = (error, req, res, next) => {
  console.error(error);

  return res
    .status(HTTPStatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: "Something went wrong." });
};

app.use(expressErrorHandler);

export default app;
