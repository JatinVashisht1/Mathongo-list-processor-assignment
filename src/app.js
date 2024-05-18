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

  return res
    .status(HTTPStatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: "Something went wrong." });
};

app.use(expressErrorHandler);

export default app;
