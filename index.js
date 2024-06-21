import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import session from "express-session";
import ejsMate from "ejs-mate";
import methodOverride from "method-override";

import userRoute from "./router/users.js";
import forumRoute from "./router/forums.js";
import articleRoute from "./router/articles.js";

import checkUser from "./middleware/checkUser.js";

dotenv.config();
const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("database connected successfully");
  } catch (error) {
    console.log("database is not connected" + error);
  }
};

connectDB();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(
  session({
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(flash());

app.use("/user", userRoute);
app.use("/forum", forumRoute);
app.use("/article", articleRoute);

app.use(checkUser, (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  let userId = null;
  if (id) {
    userId = id.toString();
  }
  res.status(404).render("notfound", { currentUser });
});
app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
