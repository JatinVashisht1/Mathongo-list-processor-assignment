import multer from "multer";
import { InvalidFileTypeError } from "./errors/InvalidFileTypeError.js";

/** Defines storage engine for for storing files, provides information about destination directory and filename */
export default multer.diskStorage({
  destination: (request, _file, callback) => {
    request.body.destination = "./csv-files";
    return callback(null, "./csv-files");
  },
  filename: (request, file, callback) => {
    const mimetype = file.mimetype;

    if (mimetype !== "text/csv") {
      return callback(
        new InvalidFileTypeError(
          "Invalid filetype. Only CSV files are allowed."
        )
      );
    }

    const fileName = `file-${Date.now()}-${Math.round(
      Math.random() * 1e5
    )}.csv`;

    request.body.fileName = fileName;

    return callback(null, fileName);
  },
});
