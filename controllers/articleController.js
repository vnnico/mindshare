import User from "../models/user.js";
import Article from "../models/article.js";

const getAllArticles = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  let userId = null;
  if (id) {
    userId = id.toString();
  }

  const articles = await Article.find({})
    .populate("author")
    .sort({ created_at: -1 });

  res.render("article", {
    currentUser,
    articles,
    userId,
  });
};

const getArticle = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  const slug = req.params.slug;
  console.log(slug);
  let userId = null;
  if (id) {
    userId = id.toString();
  }

  const user = await User.findById(id);
  const article = await Article.findOne({ slug }).populate("author");

  if (!article) {
    res.render("notfound", { currentUser });
    return;
  }

  res.render("showArticle", { article, userId, currentUser, user });
};

const createPage = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  let userId = null;
  if (id) {
    userId = id.toString();
  }

  res.render("createArticle", {
    currentUser,
  });
};

const getMyArticles = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  let userId = null;
  if (id) {
    userId = id.toString();
  }

  const articles = await Article.find({ author: id })
    .populate("author")
    .sort({ created_at: -1 });

  res.render("article", {
    currentUser,
    articles,
    userId,
  });
};

const createArticle = async (req, res, next) => {
  const body = req.body;
  const userID = res.locals.user.id;
  const file = req.file.filename;

  const article = new Article({
    title: body.title,
    author: userID,
    description: body.description,
    image: file,
    markdown: body.content,
  });

  await article.save();
  res.redirect("/article");
};

const editPage = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  const { articleId } = req.params;
  let userId = null;
  if (id) {
    userId = id.toString();
  }

  const article = await Article.findById(articleId);

  res.render("editArticle", {
    currentUser,
    article,
  });
};

const editArticle = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;

  const { articleId } = req.params;
  const { title, description, markdown } = req.body;
  const file = req.file.filename;

  try {
    const article = await Article.findById(articleId);
    if (!article) {
      console.log("forum tidak ada");
      return;
    }

    if (article.author.toString() !== id) {
      console.log("Not authorized");
      return;
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      {
        title,
        description,
        markdown,
      },
      { new: true }
    );

    if (file) {
      updatedArticle.file = file;
      await updatedArticle.save();
    }

    //res.redirect(`/forum/${updatedArticle.slug}`);
    res.redirect("/article");
  } catch (error) {
    console.log(error.message);
  }
};

const deleteArticle = async (req, res, next) => {
  const id = res.locals.user.id;
  const { articleId } = req.params;

  try {
    const article = await Article.findById(articleId);
    if (!article) {
      console.log("forum tidak ada");
      return;
    }

    if (article.author.toString() !== id) {
      console.log("Not Authorized");
      return;
    }

    await Article.findByIdAndDelete(articleId);
    res.redirect("/article");
  } catch (error) {
    console.log(error.message);
  }
};

export {
  getAllArticles,
  getArticle,
  createPage,
  getMyArticles,
  createArticle,
  editPage,
  editArticle,
  deleteArticle,
};
