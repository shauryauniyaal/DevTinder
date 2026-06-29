const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");

require("dotenv").config();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("DB Connection successful");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port " + process.env.PORT + ".");
    });
  })
  .catch(() => {
    console.log("DB Connection unsuccessful");
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
