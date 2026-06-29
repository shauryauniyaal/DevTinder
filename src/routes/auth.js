const express = require("express");
const { validateSignUp } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const fixSkills = require("../utils/fixSkills");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // 1. Validate
    validateSignUp(req);

    // 2. Encrypt
    fixSkills(req);
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      skills,
      about,
    } = req?.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const isUserPresent = await User.findOne({ emailId: emailId });

    if (isUserPresent) {
      throw new Error("Email Id already present in our database.");
    }

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      skills,
      about,
    });

    await user.save();
    res.send("User added successfully.");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message || "User was not added.");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req?.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials.");
    }
    const checkPassword = await user.validatePassword(password);
    if (checkPassword) {
      // create JWT
      const token = await user.getJWT();
      // Create cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 60 * 60 * 24 * 1000),
      });

      res.send("User logged in successfully.");
    } else {
      throw new Error("Invalid credentials.");
    }
  } catch (error) {
    res.status(400).send("Error while logging in: " + error?.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successful.");
});

module.exports = authRouter;
