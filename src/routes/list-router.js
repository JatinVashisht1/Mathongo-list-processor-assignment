import { Router } from "express";
import multer from "multer";
import {
  createList,
  getListStatusController,
  uploadListController,
} from "../controllers/list.controller.js";

const upload = multer();
const listRouter = Router();

listRouter.post("/", createList);
listRouter.post("/upload", upload.single("csvFile"), uploadListController);
listRouter.get("/status", getListStatusController);

export default listRouter;
