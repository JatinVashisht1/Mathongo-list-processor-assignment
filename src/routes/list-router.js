import { Router } from "express";
import multer from "multer";
import { createList } from "../controllers/list-controller";

/** defines storage engine for for storing files, provides information about destination directory and filename */
const storage = multer.diskStorage({
  destination: (_, _, callback) => callback(null, "../csv-files"),
  filename: (_, file, callback) =>
    callback(null, `${file.filename}-${Date.now()}-${Math.random() * 1e5}`),
});

const upload = multer({ storage });
const listRouter = Router();

listRouter.post("/", upload, createList);

export default listRouter;
