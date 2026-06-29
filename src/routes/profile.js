const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { User } = require("../models/user");
const {
  validateProfileEdit,
  validateChangePassword,
} = require("../utils/validation");
const fixSkills = require("../utils/fixSkills");
const bcrypt = require("bcrypt");
const profileAuth = express.Router();

profileAuth.get("/profile", userAuth, (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileAuth.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEdit(req)) {
      throw new Error("Invalid data edit.");
    }
    fixSkills(req);
    const id = req.user._id;
    const data = req.body;

    const user = await User.findByIdAndUpdate(id, data, {
      runValidators: true,
      returnDocument: "after",
    });

    res.send("User updated sucessfully.");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileAuth.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!validateChangePassword(req)) {
      throw new Error("Incorrect password change.");
    }

    const { password, new_password } = req?.body;
    const isPasswordCorrect = await req?.user.validatePassword(password);
    if (!password) {
      throw new Error("Enter your current password");
    }
    if (!isPasswordCorrect) {
      throw new Error("Incorrect Password.");
    }

    const newPasswordHash = await bcrypt.hash(new_password, 10);

    const user = await User.findByIdAndUpdate(
      req?.user._id,
      {
        password: newPasswordHash,
      },
      {
        runValidators: true,
        returnDocument: "after",
      },
    );

    res.send(user.firstName + ", your password was updated successfully.");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileAuth.delete("/profile/delete", userAuth, async (req, res) => {
  try {
    const id = req.user._id;
    const deletedUser = await User.findByIdAndDelete(id);
    res.send("User deleted sucessfully.");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileAuth;
