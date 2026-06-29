const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
const mongoose = require("mongoose");

const requestsRouter = express.Router();

requestsRouter.post(
  "/requests/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const fromUserId = req.user._id;
      const status = req.params.status;

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        throw new Error("Invalid id type.");
      }

      const validStatus = ["notice", "skip"];

      if (!validStatus.includes(status)) {
        throw new Error(status + " is an invalid status.");
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingRequest) {
        throw new Error("This connection request has already occured.");
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User does not exist.");
      }
      const request = new ConnectionRequest({ fromUserId, toUserId, status });
      await request.save();

      res.json({ message: "The Connection reuqest is sent.", request });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  },
);

requestsRouter.post(
  "/requests/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      if (!mongoose.isValidObjectId(requestId)) {
        throw new Error("Invalid request id.");
      }

      const existingRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "notice",
      });

      if (!existingRequest) {
        res.status(404).send("Connection Request not found.");
      }

      const updatedRequest = await ConnectionRequest.findByIdAndUpdate(
        requestId,
        {
          status: status,
        },
      );
      res.json({
        message: "Connection Request " + status + "ed successfully!",
        updatedRequest,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  },
);

module.exports = requestsRouter;
