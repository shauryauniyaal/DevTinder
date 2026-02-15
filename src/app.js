const express = require("express");

const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { default: mongoose } = require("mongoose");

const app = express();

app.post("/signup", (req, res) => {
  const user = new User({
    firstName: "Abc",
    lastName: "Xyz",
    emailId: "abc@xyz.com",
    password: "abc123",
    age: "24",
    gender: "Male",
  });
  try {
    user.save();
    res.send("User added successfully.");
  } catch (err) {
    res.status(400).send("User was not added.");
  }
});

connectDB()
  .then(() => {
    console.log("DB Connection successful");
    app.listen(7777, () => {
      console.log("Server is running on port 7777.");
    });
  })
  .catch(() => {
    console.log("DB Connection unsuccessful");
  });
