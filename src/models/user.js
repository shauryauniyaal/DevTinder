const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid.");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data not valid.");
        }
      },
    },
    photoURL: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("URL is not valid.");
        }
      },
    },
    about: {
      type: String,
      default: "This is me!",
    },
    skills: {
      type: [String],
      validate(value) {
        value = [
          ...new Set(
            value
              .map((s) => s.trim().toLowerCase())
              .filter((s) => s.length > 0),
          ),
        ];
        if (value.length > 10) {
          throw new Error("You can only add 10 skills.");
        }
      },
    },
  },
  { timestamps: true }, // To get createdOn and updatedOn for documents
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
