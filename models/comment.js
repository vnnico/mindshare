import mongoose from "mongoose";
import User from "./user.js";

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    body: String,
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
