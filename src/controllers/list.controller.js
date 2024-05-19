import express from "express";
import fs from "fs";
import { HTTPStatusCodes } from "../utils/http-status-codes.js";
import {
  createCustomPropertiesService,
  createListService,
  updateFilePath,
} from "../services/list.service.js";
import csv from "csv-parser";
import listModel from "../database/list-model.js";

/**
 * Controller for POST '/list' route.
 *
 * @type {express.RequestHandler}
 */
export const createList = async (request, response, next) => {
  const { name, customProperties: customPropertyList } = request.body ?? {};

  if (!name) {
    return response
      .status(HTTPStatusCodes.BAD_REQUEST)
      .json({ success: false, message: "name is required field." });
  }

  // check if given custom property list have correct shape
  const isCustomPropertyListValid =
    checkCustomPropertyListValid(customPropertyList);

  if (!isCustomPropertyListValid && customPropertyList) {
    return response
      .status(HTTPStatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Invalid custom properties." });
  }

  try {
    const createdListRecordId = await createListService({
      listName: name,
    });

    if (!createdListRecordId) {
      return response.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to create list. Something went wrong.",
      });
    }

    if (customPropertyList) {
      await createCustomPropertiesService({
        customPropertyList,
        listId: createdListRecordId,
      });
    }

    return response
      .status(HTTPStatusCodes.CREATED)
      .json({ success: true, message: "List schema created successfully." });
  } catch (error) {
    console.error(
      `controllers/list.controller.js: Error while processing POST /list request`,
      error.message
    );

    next(error, request, response);
  }
};

/**
 * Controller for POST '/list/upload' route
 *
 * @type {express.RequestHandler}
 */
export const uploadListController = async (request, response, next) => {
  try {
    const { name, fileName, destination } = request.body ?? {};
    const csvFile = request.file;

    if (!csvFile) {
      return response.status(HTTPStatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Provide a CSV file to upload",
      });
    }

    if (!name) {
      return response.status(HTTPStatusCodes.BAD_REQUEST).json({
        success: false,
        message: "name is required field.",
      });
    }

    const path = `${destination}/${fileName}`;

    await updateFilePath({ name, path });

    return response
      .status(HTTPStatusCodes.OK)
      .json({ success: true, message: "File uploaded successfully" });
  } catch (error) {
    console.log(
      `controlelrs/list.controller.js: Error prosessing upload list request, ${error.message}`
    );

    next(error);
  }
};

const checkCustomPropertyListValid = (customPropertyList) => {
  if (!Array.isArray(customPropertyList)) {
    return false;
  }

  for (const customProperty of customPropertyList) {
    if (!customProperty.property || !customProperty.defaultValue) {
      return false;
    }
  }

  return true;
};
