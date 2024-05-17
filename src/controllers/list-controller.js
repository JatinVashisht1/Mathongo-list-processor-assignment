import { RequestHandler } from "express";

/**
 * Controller for POST '/list' route.
 * @type {RequestHandler}
 */
export const createList = async (req, res) => {
  return res.status(200).json({ success: true });
};
