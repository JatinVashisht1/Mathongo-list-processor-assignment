import mongoose, { Schema, model } from "mongoose";

const customPropertySchema = new Schema({
  listId: {
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
    unique: true,
  },
  customProperties: {
    type: [customPropertySchema],
    default: [],
  },
});

const propertyModel = model("property", userSchema);

export default propertyModel;
