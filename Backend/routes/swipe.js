const express = require("express");
const swipeRouter = express.Router();
const userAuth = require("../middleware/userAuth");
const Swipe = require("../models/swipe");
const Match = require("../models/match");
const mongoose = require("mongoose");

swipeRouter.post("/swipe/:type/:toUserId", userAuth, async (req, res) => {
  try {
    const { type, toUserId } = req.params;
    const fromUserId = req.user._id;

    // ✅ VALIDATION
    if (!["like", "pass", "skip"].includes(type)) {
      throw new Error("Invalid swipe type");
    }

    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      throw new Error("Invalid user ID");
    }

    if (fromUserId.toString() === toUserId) {
      throw new Error("Cannot swipe yourself");
    }

    // ✅ UPSERT SWIPE (overwrite previous)
    const swipe = await Swipe.findOneAndUpdate(
      { fromUserId, toUserId },
      { type },
      { upsert: true, new: true }
    );

    // 🚨 EDGE CASE: PASS should kill any future match possibility
    if (type === "pass") {
      return res.json({
        message: "User passed",
        isMatch: false,
      });
    }

    // 🚨 SKIP → just store, no match logic
    if (type === "skip") {
      return res.json({
        message: "User skipped",
        isMatch: false,
      });
    }

    // 🔥 MATCH LOGIC (ONLY FOR LIKE)
    if (type === "like") {
      const reverseLike = await Swipe.findOne({
        fromUserId: toUserId,
        toUserId: fromUserId,
        type: "like",
      });

      // ❌ If other user already passed → no match
      const reversePass = await Swipe.findOne({
        fromUserId: toUserId,
        toUserId: fromUserId,
        type: "pass",
      });

      if (reversePass) {
        return res.json({
          message: "Other user already passed",
          isMatch: false,
        });
      }

      if (reverseLike) {
        // ✅ SORT USERS (VERY IMPORTANT)
        const sortedUsers = [fromUserId, toUserId]
          .map((id) => id.toString())
          .sort();

        await Match.findOneAndUpdate(
          { users: sortedUsers },
          { users: sortedUsers },
          { upsert: true, new: true }
        );

        return res.json({
          message: "🎉 It's a Match!",
          isMatch: true,
        });
      }
    }

    return res.json({
      message: "Swipe recorded",
      isMatch: false,
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = swipeRouter;