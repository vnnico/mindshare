import User from "../models/user.js";
import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60;
const generateToken = (id) => {
  return jwt.sign({ id }, "secret-nic", {
    expiresIn: maxAge,
  });
};

const getLogin = (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;

  res.render("login", { currentUser });
};

const getRegister = (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;

  res.render("register", { currentUser });
};

const loginController = async (req, res, next) => {
  const { name, email, password, dob, phone } = req.body;
  try {
    const user = await User.login(email, password);
    if (user) {
      const token = generateToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.redirect("/forum");
    }
  } catch (err) {
    return res.status(400).send("Authentication failed");
    res.redirect("/user/login"); // sementara
  }
};

const registerController = async (req, res, next) => {
  const { name, email, password, dob, phone } = req.body;

  const existingUserByName = await User.findOne({ name: name });
  const existingUserByEmail = await User.findOne({ email: email });

  if (existingUserByName) {
    return res.status(400).send("Name is already taken");
  }

  if (existingUserByEmail) {
    return res.status(400).send("Email is already registered");
  }
  const user = new User({
    name,
    email,
    password,
    dob,
    phone,
  });

  await user.save();
  const token = generateToken(user._id);
  res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
  res.redirect("/forum");
};

const logoutController = async (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/forum");
};

const formatDate = (date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const getProfile = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  const user = await User.findById(id);
  const date = formatDate(new Date(user.dob));
  res.render("profile", { date, user, currentUser });
};

const updateProfile = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  const { name, date, phone } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("user tidak ada");
      return;
    }

    if (profileImage) {
      const updateUser = await User.findByIdAndUpdate(
        id,
        {
          name,
          dob: date,
          phone,
          image: profileImage,
        },
        { new: true }
      );
    } else {
      const updateUser = await User.findByIdAndUpdate(
        id,
        {
          name,
          dob: date,
          phone,
        },
        { new: true }
      );
    }

    res.redirect("/user/profile");
  } catch (error) {
    console.log(error.message);
  }
};

const verify = async (req, res, next) => {
  const currentUser = res.locals.user ? res.locals.user : null;
  const id = res.locals.user ? res.locals.user.id : null;
  const verify = req.body.verify ? "verify" : null;

  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("user tidak ada");
      return;
    }

    if (verify) {
      await User.findByIdAndUpdate(id, { role: verify }, { new: true });

      res.redirect("/user/profile");
    }
  } catch (error) {
    console.log(error.message);
  }
};

export {
  getLogin,
  getRegister,
  loginController,
  registerController,
  logoutController,
  getProfile,
  updateProfile,
  verify,
};
