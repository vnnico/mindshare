import mongoose from "mongoose";
import User from "./user.js";

const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
  bookmarkers: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Bookmark", bookmarkSchema);
