const mongoose = require("mongoose");
const Joi = require("joi");
const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },

  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: null,
  },
});
const User = mongoose.model("user", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(500).required(),
    password: Joi.string().min(8).max(1024).required(),
  });
  return schema.validate(user);
};
module.exports = { User, validateUser };
