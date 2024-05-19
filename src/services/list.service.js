import { addListProcessingJob } from "../background-jobs/queue-manager.js";
import ListModel from "../database/list-model.js";
import PropertyModel from "../database/property-model.js";
import { RecordAlreadyExistError } from "../utils/errors/RecordAlreadyExistError.js";
import { RecordNotExistError } from "../utils/errors/RecordNotExistError.js";
import { Readable } from "stream";
import csvParser from "csv-parser";

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

/**
 * Service to update path field of a list record.
 *
 * @param {object} param0 Object required to update file path.
 * @param {string} param0.name Name of list to update.
 * @param {string} param0.name Path of stored csv file
 */
export const updateFilePathService = async ({ name, path }) => {
  const updateFilePathResult = await ListModel.updateOne(
    { name },
    { path }
  ).exec();

  if (
    !updateFilePathResult.acknowledged ||
    !updateFilePathResult.matchedCount
  ) {
    throw new RecordNotExistError(`No file list with name ${name} exist.`);
  }
};

export const processCSVFile = async ({ csvBuffer, listName }) => {
  const readableStream = new Readable({
    read() {
      this.push(csvBuffer);
      this.push(null);
    },
  });

  const listDbModel = await ListModel.findOne({ name: listName });

  if (!listDbModel) {
    throw RecordNotExistError(`List with name ${listName} not exist.`);
  }

  await ListModel.updateOne(
    {
      name: listName,
    },
    {
      failed: 0,
      total: 0,
      completed: 0,
      reasons: [],
    }
  );

  let entriesCount = 0;

  readableStream
    .pipe(csvParser())
    .on("data", async (data) => {
      const jobData = { userData: data, listId: listDbModel._id };

      if (!Object.keys(data)?.length) return;

      entriesCount++;

      await addListProcessingJob(jobData);
    })
    .on("end", () => console.info("Finished reading file"))
    .on("error", (error) => {
      console.error("error while reading file ", error.message);

      throw error;
    });

  await ListModel.updateOne(
    {
      name: listName,
    },
    {
      total: entriesCount,
    }
  );
};
