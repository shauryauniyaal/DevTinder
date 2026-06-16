const express = require("express");

const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { default: mongoose, set } = require("mongoose");
const { validateSignUp } = require("./utils/validateSignUp");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    // 1. Validate
    validateSignUp(req);

    // 2. Encrypt
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

    console.log(passwordHash);

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
    res.status(400).send(err.message || "User was not added.");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req?.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials.");
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
      res.send("User logged in successfully.");
    } else {
      throw new Error("Invalid credentials.");
    }
  } catch (error) {
    res.status(400).send("Error while logging in: " + error?.message);
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

app.patch("/users/:id", async (req, res) => {
  const id = req.params?.id;
  const data = req.body;
  try {
    if (data?.skills) {
      data.skills = [
        ...new Set(
          data.skills
            .map((s) => s.trim().toLowerCase())
            .filter((s) => s.length > 0),
        ),
      ];

      if (data?.skills.length > 10) {
        throw new Error("You can only add 10 skills.");
      }
    }
    if (data?.password) {
      const currPassword = await User.findById(id, "password");

      if (currPassword?.password == data?.password) {
        throw new Error("New Password cannot be same as the current password.");
      }
      if (data?.password.includes(".")) {
        throw new Error("You cannot have '.' in the password.");
      }
    }

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
