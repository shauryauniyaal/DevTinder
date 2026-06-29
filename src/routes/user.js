const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

const userRouter = express.Router();

const EXPOSED_USER_DETAILS = "firstName lastName age gender about skills"; // == ["firstName", "lastName", "age", "gender", "about", "skills"]

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "notice",
    })
      .populate("fromUserId", EXPOSED_USER_DETAILS)
      .select("fromUserId");

    res.json({
      message: "Connection Requests retrieval successful.",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accept",
    })
      .populate("fromUserId", EXPOSED_USER_DETAILS)
      .populate("toUserId", EXPOSED_USER_DETAILS);

    const data = connections.map((row) => {
      if (row.fromUserId.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ message: "Connections retrieved Successfully.", data });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          $or: [
            { fromUserId: loggedInUser._id },
            { toUserId: loggedInUser._id },
          ],
          status: { $in: ["accept", "skip", "reject"] },
        },
        { fromUserId: loggedInUser._id, status: "notice" },
      ],
    });

    const incomingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "notice",
    })
      .select("fromUserId")
      .lean();

    const incomingRequestsSenderIds = incomingRequests.map((request) =>
      request.fromUserId.toString(),
    );

    const inelligibleUserIds = connectionRequests.map((row) => {
      if (loggedInUser._id.equals(row.fromUserId)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    inelligibleUserIds.push(loggedInUser._id);

    const requiredUsers = await User.find({
      _id: { $nin: inelligibleUserIds },
    }).select(EXPOSED_USER_DETAILS);

    const data = requiredUsers.map((user) => {
      if (incomingRequestsSenderIds.includes(user._id.toString())) {
        return { ...user._doc, status: "notice" };
      }
      return { ...user._doc, status: null };
    });

    res.json({ message: "Feed retrieved successfully.", data });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = userRouter;
