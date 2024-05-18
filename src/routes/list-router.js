import { Router } from "express";
import multer from "multer";
import { createList } from "../controllers/list.controller.js";

/** Defines storage engine for for storing files, provides information about destination directory and filename */
const storage = multer.diskStorage({
  destination: (_request, _file, callback) => callback(null, "../csv-files"),
  filename: (request, _file, callback) =>
    callback(null, `${request.body.listName}.csv`),
});

const upload = multer({ storage });
const listRouter = Router();

listRouter.post("/", createList);

export default listRouter;
