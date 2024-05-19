import { model, Schema } from "mongoose";

const listSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    path: String,
    active: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Number,
      default: 0,
    },
    failed: {
      type: Number,
      default: 0,
    },
    reasons: [String],
  },
  {
    timestamps: true,
  }
);

const listModel = model("list", listSchema);

export default listModel;
