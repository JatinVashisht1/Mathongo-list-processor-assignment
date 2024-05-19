import mongoose, { Schema, model } from "mongoose";

const customPropertySchema = new Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema({
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  customProperties: {
    type: [customPropertySchema],
    default: [],
  },
});

const userModel = model("user", userSchema);

export default userModel;
