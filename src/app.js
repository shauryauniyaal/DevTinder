const express = require("express");

const app = express();

// request handlers

app.get("/user", (req, res) => {
  res.send({ firstName: "Shaurya", lastName: "Uniyal" });
});

app.post("/user", (req, res) => {
  res.send("POST req successful");
});

app.patch("/user", (req, res) => {
  res.send("PATCH req successful");
});

app.delete("/user", (req, res) => {
  res.send("DELETE req successful");
});

app.use("/test", (req, res) => {
  res.send("This is the test page!");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777.");
});
