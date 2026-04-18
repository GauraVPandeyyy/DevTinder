const express = require("express");
const userAuth = require("../middleware/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/userModel");
const Match = require("../models/match");
const Swipe = require("../models/swipe");

const userRouter = express.Router();

const SAFE_USER_DATA = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "about",
  "photoUrl",
  "skills",
  "jobTitle",
];

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionReceived = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_USER_DATA);

    return res.status(200).json({
      message: "Data fetched Successfully",
      data: connectionReceived,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// userRouter.get("/user/connections", userAuth, async (req, res) => {
//   try {
//     const loggedInUser = req.user;

//     const connections = await ConnectionRequest.find({
//       $or: [
//         { toUserId: loggedInUser._id, status: "accepted" },
//         { fromUserId: loggedInUser._id, status: "accepted" },
//       ],
//     })
//       .populate("fromUserId", SAFE_USER_DATA)
//       .populate("toUserId", SAFE_USER_DATA);

//     const data = connections.map((row) => {
//       if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
//         return row.toUserId;
//       }
//       return row.fromUserId;
//     });

//     return res.status(200).json({ message: "Data fetched Successfully", data });
//   } catch (err) {
//     return res.status(400).json({ message: err.message });
//   }
// });

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);

    // 🔥 GET ALL SWIPES RELATED TO USER
    const swipes = await Swipe.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    });

    const hiddenUsers = new Set();
    const skippedUsers = new Set();

    swipes.forEach((s) => {
      const from = s.fromUserId.toString();
      const to = s.toUserId.toString();
      const me = loggedInUser._id.toString();

      // ❌ PASS → hide BOTH sides
      if (s.type === "pass") {
        hiddenUsers.add(from);
        hiddenUsers.add(to);
      }

      // ❌ LIKE → hide only from current user feed
      if (s.type === "like" && from === me) {
        hiddenUsers.add(to);
      }

      // ⏭ SKIP → store separately
      if (s.type === "skip" && from === me) {
        skippedUsers.add(to);
      }
    });

    // ❌ MATCH → hide BOTH users
    const matches = await Match.find({
      users: loggedInUser._id,
    });

    matches.forEach((m) => {
      m.users.forEach((id) => hiddenUsers.add(id.toString()));
    });

    // ❌ NEVER show self
    hiddenUsers.add(loggedInUser._id.toString());

    // 🔥 STEP 1: GET FRESH USERS FIRST
    const freshUsers = await User.find({
      _id: {
        $nin: [...hiddenUsers, ...Array.from(skippedUsers)],
      },
    })
      .select(
        "firstName lastName age gender about photoUrl skills jobTitle"
      )
      .limit(limit);

    let finalUsers = [...freshUsers];

    // 🔥 STEP 2: IF NOT ENOUGH → ADD SKIPPED USERS
    if (finalUsers.length < limit && skippedUsers.size > 0) {
      const remaining = limit - finalUsers.length;

      const skipped = await User.find({
        _id: { $in: Array.from(skippedUsers) },
      })
        .select(
          "firstName lastName age gender about photoUrl skills jobTitle"
        )
        .limit(remaining);

      finalUsers = [...finalUsers, ...skipped];
    }

    // 🧠 MATCH SCORE LOGIC (SAFE)
    const feed = finalUsers.map((user) => {
      const currentSkills = loggedInUser.skills || [];
      const otherSkills = user.skills || [];

      const common = currentSkills.filter((skill) =>
        otherSkills.some(
          (s) => s.toLowerCase() === skill.toLowerCase()
        )
      );

      const score =
        currentSkills.length === 0
          ? 0
          : Math.round((common.length / currentSkills.length) * 100);

      return {
        ...user.toObject(),
        matchScore: score,
        commonSkills: common,
      };
    });

    return res.json({
      message: "Feed fetched",
      feed,
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

userRouter.get("/user/matches", userAuth, async (req, res) => {
  try {
    const matches = await Match.find({
      users: req.user._id,
    }).populate("users", "firstName lastName photoUrl");

    const data = matches
      .map((m) =>
        m.users.find(
          (u) => u._id.toString() !== req.user._id.toString()
        )
      )
      .filter(Boolean); // 🔥 remove undefined

    return res.status(200).json({
      success: true,
      message: "Matches fetched successfully",
      data,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

userRouter.get("/user/lastSeen/:userId", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("lastSeen");
    res.json({ lastSeen: user?.lastSeen });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

userRouter.get("/user/:id", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "firstName lastName photoUrl age gender about skills jobTitle",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
