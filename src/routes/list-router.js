import { Router } from "express";
import multer from "multer";
import {
  createList,
  uploadListController,
} from "../controllers/list.controller.js";
import csvStorageEngine from "../utils/csv-storage-engine.js";

const upload = multer();
const listRouter = Router();

listRouter.post("/", createList);
listRouter.post("/upload", upload.single("csvFile"), uploadListController);

export default listRouter;
