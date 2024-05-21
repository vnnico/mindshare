import mongoose from "mongoose";
import slugify from "slugify";
import User from "./user.js";
import Comment from "./comment.js";
import Bookmark from "./bookmark.js";

const Schema = mongoose.Schema;

const forumSchema = new Schema(
  {
    title: String,
    image: [
      {
        type: String,
        required: false,
      },
    ],
    description: String,
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    created_at: {
      type: Date,
      default: new Date(),
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    liked_by: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    bookmark: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bookmark",
      },
    ],
    isAnonymous: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

forumSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  next();
});

const Forum = mongoose.model("Forum", forumSchema);

// async function resetForumCollection() {
//   try {
//     // Hapus semua dokumen dari koleksi Forum
//     await Forum.deleteMany({});
//     console.log("Koleksi Forum berhasil direset.");
//   } catch (error) {
//     console.error("Gagal mereset koleksi Forum:", error);
//   }
// }

// // Panggil fungsi resetForumCollection untuk melakukan reset
// resetForumCollection();
export default Forum;
