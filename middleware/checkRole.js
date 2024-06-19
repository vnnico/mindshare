const checkRole = (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  if (currentUser.role === "verify") {
    next();
  } else {
    res.redirect("/article");
  }
};

export default checkRole;
