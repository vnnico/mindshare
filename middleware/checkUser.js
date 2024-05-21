import jwt from "jsonwebtoken";
import User from "../models/user.js";

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "secret-nic", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.redirect("/user/login");
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    res.redirect("/user/login");
  }
};

export default checkUser;
