const mongoose = require("mongoose");

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
        if (!value.includes("@gmail.com")) {
          throw new Error("Email id not valid.");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 20,
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
    },
    about: {
      type: String,
      default: "This is me!",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }, // To get createdOn and updatedOn for documents
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
