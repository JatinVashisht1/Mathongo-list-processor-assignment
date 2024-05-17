import mongoose, { Schema, model } from "mongoose";

const propertySchema = new Schema({
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  fallbackValue: {
    type: String,
    required: true,
  },
});

const propertyModel = model("property", propertySchema);

export default propertyModel;
