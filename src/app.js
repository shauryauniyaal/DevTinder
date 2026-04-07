const express = require("express");

const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { default: mongoose } = require("mongoose");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully.");
  } catch (err) {
    res.status(400).send(err.message || "User was not added.");
  }
});

app.get("/users", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.send(users);
    }
  } catch {
    res.status(400).send("Something went wrong.");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.send(users);
    }
  } catch {
    res.status(400).send("Something went wrong.");
  }
});

app.get("/id", async (req, res) => {
  const id = req.body._id;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send("User not found.");
    } else {
      res.send(user);
    }
  } catch {
    res.status(400).send("Something went wrong.");
  }
});

app.delete("/users", async (req, res) => {
  const id = req.body._id;
  try {
    const user = await User.findByIdAndDelete(id);
    res.send("User deleted sucessfully.");
  } catch (error) {
    res.status(400).send("Something went wrong.");
  }
});

app.patch("/users", async (req, res) => {
  const id = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, data, {
      runValidators: true,
      returnDocument: "after",
    });
    res.send("User updated sucessfully.");
  } catch (error) {
    res.status(400).send(error.message);
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
