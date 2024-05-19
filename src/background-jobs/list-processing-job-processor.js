import bullmq from "bullmq";
import { InsufficientDataError } from "../utils/errors/InsufficientDataError.js";
import UserModel from "../database/user-model.js";
import PropertyModel from "../database/property-model.js";
import { RecordAlreadyExistError } from "../utils/errors/RecordAlreadyExistError.js";

/**
 * Job processor for list queue worker
 * @type {bullmq.Processor<any, any, string>}
 * */
export const saveUserProcessor = async (listJob) => {
  const { userData, listId } = listJob.data;
  const email = userData?.email;
  const userName = userData?.name;

  if (!userName || !email) {
    throw new InsufficientDataError("Not enough data to save user.");
  }

  const existingUser = await UserModel.findOne({ email, listId }).exec();

  if (existingUser) {
    throw new RecordAlreadyExistError(
      `User with email ${email} already exist in list.`
    );
  }

  const customPropertyModelList = await PropertyModel.find({
    listId,
  }).exec();

  const userCustomPropertyList = customPropertyModelList.map(
    (customPropertyModel) => {
      const propertyId = customPropertyModel._id;
      const propertyName = customPropertyModel.name;
      const value = userData[propertyName] ?? customPropertyModel.fallbackValue;

      return { propertyId, value };
    }
  );

  const userModel = {
    email,
    listId,
    name: userName,
    customProperties: userCustomPropertyList,
  };

  await UserModel.create(userModel);

  console.log(`background-jobs/lpjp: created user model for name ${userName}`);
};
