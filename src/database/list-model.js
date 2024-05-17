import { model, Schema } from "mongoose";

const listSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const listModel = model("list", listSchema);

export default listModel;
