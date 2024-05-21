import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import session from "express-session";
import ejsMate from "ejs-mate";
import methodOverride from "method-override";

import userRoute from "./router/users.js";
import forumRoute from "./router/forums.js";

const app = express();
// mongoose
//   .connect("mongodb://127.0.0.1:27017/mindshare")
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error);
//   });

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://MindShare:mindshare@mindshare.ees2oeh.mongodb.net/mindshare?retryWrites=true&w=majority&appName=MindShare"
    );
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

// app.get("/", async (req, res) => {
//   res.render("index");
// });
app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
