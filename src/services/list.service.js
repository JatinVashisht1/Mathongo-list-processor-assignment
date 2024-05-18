import ListModel from "../database/list-model.js";
import PropertyModel from "../database/property-model.js";
import { RecordAlreadyExistError } from "../utils/errors/RecordAlreadyExistError.js";
import { RecordNotExistError } from "../utils/errors/RecordNotExistError.js";

/**
 * Service function responsible for inserting new record into `lists` collection.
 *
 * @param {object} param0 Object required to create a new list.
 * @param {string} param0.listName Name of list.
 * @param {string} param0.listPath Path at which list will be stored.
 *
 * @returns {Promise<string | null>} ID of created document or null if unable to create list.
 */
export const createListService = async ({ listName, listPath }) => {
  const isListNameTaken = await ListModel.findOne({ name: listName }).exec();

  if (isListNameTaken) {
    throw new RecordAlreadyExistError(`Name ${listName} is already taken.`);
  }

  const createListResult = await ListModel.create({
    name: listName,
    path: listPath,
  });

  return createListResult._id;
};

/**
 * Service function that creates custom properties with their fallback values corresponding to a list.
 *
 * @param {object} param0 Object required to create custom properties.
 * @param {string} param0.listId Database ID of list record.
 * @param {Array<{property: string, defaultValue: string}>} param0.customPropertyList List of custom properties.
 */
export const createCustomPropertiesService = async ({
  listId,
  customPropertyList,
}) => {
  const existingListDocument = await ListModel.findById(listId).exec();

  if (!existingListDocument) {
    throw RecordNotExistError(`List with given id: ${listId} not exist`);
  }

  const customPropertyDbModelList = customPropertyList.map(
    (customProperty) => ({
      listId,
      name: customProperty.property,
      fallbackValue: customProperty.defaultValue,
    })
  );

  await PropertyModel.create(customPropertyDbModelList);
};