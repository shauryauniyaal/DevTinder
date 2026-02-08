const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth); // Usage of middlewares here

app.get("/admin/getData", (req, res) => {
  res.send("Getting data");
});

app.post("/admin/postData", (req, res) => {
  res.send("Posting data");
});

app.get("/user/profile", userAuth, (req, res) => {
  // Middlewares also used here
  res.send("Getting user profile");
});

app.get("/user/login", (req, res) => {
  res.send("Logging in");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777.");
});
