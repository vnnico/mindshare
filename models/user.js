import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: String,
  email: String,
  image: String,
  password: String,
  role: {
    type: String,
    require: false,
  },
  dob: Date,
  phone: String,
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new Error("Authentication failed!");
  }
  throw new Error("Authentication failed!");
};

export default mongoose.model("User", userSchema);
