const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://user1:oukg0v2slSDJWB8c@cluster0.hpmop0j.mongodb.net/devTinder",
  );
};

module.exports = {
  connectDB,
};
