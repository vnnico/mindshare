import Forum from "../models/forum.js";
import Comment from "../models/comment.js";
import User from "../models/user.js";

const getAllForum = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  let userId = null;
  if (id) {
    userId = id.toString();
  }

  const user = await User.findById(id);

  const forums = await Forum.find({})
    .populate("author")
    .populate({
      path: "comment",
      populate: {
        path: "author",
      },
    })
    .populate("liked_by")
    .sort({ createdAt: "desc" });

  res.render("index", {
    forums,
    currentUser,
    userId,
    user,
  });
};

const getForum = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  const slug = req.params.slug;
  const userId = id.toString();

  const user = await User.findById(id);
  const forum = await Forum.findOne({ slug })
    .populate("author")
    .populate({
      path: "comment",
      populate: {
        path: "author",
      },
    })
    .populate("liked_by");

  if (!forum) {
    res.render("notfound", { currentUser });
    return;
  }

  res.render("show", { forum, userId, currentUser, user });
};

const getMyForum = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  let userId = null;
  if (id) {
    userId = id.toString();
  }

  const user = await User.findById(id);

  const forums = await Forum.find({ author: id })
    .populate("author")
    .populate({
      path: "comment",
      populate: {
        path: "author",
      },
    })
    .populate("liked_by")
    .sort({ createdAt: "desc" });

  res.render("index", {
    forums,
    currentUser,
    userId,
    user,
  });
};

const getMostLikeForum = async (req, res, next) => {
  try {
    const currentUser = res.locals.user ? res.locals.user : null;
    const id = res.locals.user ? res.locals.user.id : null;
    let userId = null;
    if (id) {
      userId = id.toString();
    }

    const user = await User.findById(id);

    const forums = await Forum.aggregate([
      {
        $addFields: {
          likedByCount: { $size: "$liked_by" },
          commentCount: { $size: "$comment" },
        },
      },
      {
        $sort: { likedByCount: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $lookup: {
          from: "comments",
          localField: "comment",
          foreignField: "_id",
          as: "comments",
        },
      },
      {
        $unwind: {
          path: "$comments",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.author",
          foreignField: "_id",
          as: "comments.author",
        },
      },
      {
        $unwind: {
          path: "$comments.author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          image: { $first: "$image" },
          description: { $first: "$description" },
          slug: { $first: "$slug" },
          created_at: { $first: "$created_at" },
          author: { $first: "$author" },
          liked_by: { $first: "$liked_by" },
          comments: { $push: "$comments" },
          likedByCount: { $first: "$likedByCount" },
          bookmark: { $first: "$bookmark" },
          isAnonymous: { $first: "$isAnonymous" },
        },
      },
      {
        $sort: { likedByCount: -1 },
      },
    ]);

    // Pastikan comments adalah array yang valid
    forums.forEach((forum) => {
      forum.comment = forum.comments.filter(
        (comment) => comment && comment._id
      );
    });

    res.render("index", {
      forums,
      currentUser,
      userId,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const getMostCommentForum = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  let userId = null;
  if (id) {
    userId = id.toString();
  }

  const user = await User.findById(id);

  // Mengambil semua forum
  const forums = await Forum.find({})
    .populate("author")
    .populate({
      path: "comment",
      populate: {
        path: "author",
      },
    })
    .populate("liked_by");

  // Mengurutkan forum berdasarkan jumlah komentar
  forums.sort((a, b) => b.comment.length - a.comment.length);

  res.render("index", {
    forums,
    currentUser,
    userId,
    user,
  });
};

const getCreate = (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  res.render("create", { currentUser });
};

const create = async (req, res, next) => {
  const body = req.body;
  const userID = res.locals.user.id;
  const files = req.files;

  console.log(body);
  console.log(files);

  const image = files.map((file) => file.filename);

  const forum = new Forum({
    title: body.title,
    author: userID,
    description: body.description,
    isAnonymous: body.isAnonymous ? true : false,
    image: image,
  });

  await forum.save();

  res.redirect("/forum");
};

const like = async (req, res, next) => {
  const userID = res.locals.user.id;
  const forumId = req.body.forumId;

  try {
    // Add userID to liked_by array only if it's not already there
    const forum = await Forum.findByIdAndUpdate(
      forumId,
      {
        $addToSet: { liked_by: userID },
      },
      { new: true }
    );

    if (!forum) {
      console.log("Forum not found");
      return res.status(404).json({ message: "Forum not found" });
    }

    const likeCount = forum.liked_by.length;
    res.json(likeCount); // Send back the count of likes
  } catch (error) {
    console.log("Error in /like route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const unlike = async (req, res, next) => {
  const userID = res.locals.user.id;
  const forumId = req.body.forumId;

  try {
    // Remove userID from liked_by array
    const forum = await Forum.findByIdAndUpdate(
      forumId,
      {
        $pull: { liked_by: userID },
      },
      { new: true }
    );

    if (!forum) {
      console.log("Forum not found");
      return res.status(404).json({ message: "Forum not found" });
    }

    const likeCount = forum.liked_by.length;
    res.json(likeCount); // Send back the updated count of likes
  } catch (error) {
    console.log("Error in /unlike route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const comment = async (req, res, next) => {
  const { forumId } = req.params;
  const user = res.locals.user;
  const comment = req.body.comment;

  try {
    const forum = await Forum.findById(forumId);
    if (!forum) {
      console.log("Forum not found");
      return res.status(404).json({ message: "Forum not found" });
    }
    const newComment = new Comment({
      body: comment,
      author: user.id,
    });

    await newComment.save();
    forum.comment.push(newComment);
    await forum.save();

    res.redirect(`/forum/${forum.slug}`);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  const { forumId, commentId } = req.params;
  const user = res.locals.user;

  try {
    const forum = await Forum.findById(forumId);
    if (!forum) {
      console.log("Forum not found");
      return res.status(404).json({ message: "Forum not found" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      console.log("Comment not found");
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== user.id.toString()) {
      console.log("User not authorized");
      return res.status(401).json({ message: "User not authorized" });
    }

    forum.comment = forum.comment.filter(
      (id) => id.toString() !== commentId.toString()
    );
    await forum.save();
    await comment.deleteOne();
    res.redirect(`/forum/${forum.slug}`);
  } catch (error) {
    next(error);
  }
};

const editForumPage = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  const { forumId } = req.params;

  try {
    const forum = await Forum.findById(forumId);
    if (forum.author.toString() !== id) {
      console.log("ga bisa");
      return res.redirect("/forum");
    }

    const forumImages = forum.image;
    // console.log(forumImages);

    res.render("edit", {
      forum,
      forumImages,
      currentUser,
    });
  } catch (error) {
    console.log("error");
    console.log(error.message);
  }
};

const editForum = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;

  const { forumId } = req.params;
  const { title, description, isAnonymous } = req.body;

  const files = req.files;
  let image =
    files && files.length > 0 ? files.map((file) => file.filename) : null;

  try {
    const forum = await Forum.findById(forumId);
    if (!forum) {
      console.log("forum tidak ada");
      return;
    }

    if (forum.author.toString() !== id) {
      console.log("Not authorized");
      return;
    }

    const updatedForum = await Forum.findByIdAndUpdate(
      forumId,
      {
        title,
        description,
        isAnonymous: isAnonymous ? true : false,
      },
      { new: true }
    );

    if (image) {
      updatedForum.image = image;
      await updatedForum.save();
    }

    res.redirect(`/forum/${updatedForum.slug}`);
  } catch (error) {
    console.log(error.message);
  }
};

const deleteForum = async (req, res, next) => {
  const id = res.locals.user.id;
  const { forumId } = req.params;

  try {
    const forum = await Forum.findById(forumId);
    if (!forum) {
      console.log("forum tidak ada");
      return;
    }

    if (forum.author.toString() !== id) {
      console.log("Not Authorized");
      return;
    }

    await Forum.findByIdAndDelete(forumId);
    res.redirect("/forum");
  } catch (error) {
    console.log(error.message);
  }
};

export {
  getForum,
  getAllForum,
  getMyForum,
  getMostLikeForum,
  getMostCommentForum,
  getCreate,
  create,
  like,
  unlike,
  comment,
  editForumPage,
  editForum,
  deleteForum,
  deleteComment,
};
