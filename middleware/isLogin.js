import jwt from "jsonwebtoken";

const isLogin = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, "secret-nic", (err, decodedToken) => {
      if (err) {
        next();
      } else {
        res.redirect("/forum");
      }
    });
  } else {
    next();
  }
};

export default isLogin;
