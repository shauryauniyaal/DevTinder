const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("You must sign in.");
    }
    const decoded_data = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decoded_data;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("The user does not exist.");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
};

module.exports = {
  userAuth,
};
