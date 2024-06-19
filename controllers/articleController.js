import User from "../models/user.js";

const getAllArticles = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  let userId = null;
  if (id) {
    userId = id.toString();
  }
  res.render("article", {
    currentUser,
  });
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
  res.render("article", {
    currentUser,
  });
};

export { getAllArticles, createPage, getMyArticles };
