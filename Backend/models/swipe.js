// models/swipe.js

const mongoose = require("mongoose");

const swipeSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "pass", "skip"],
      required: true,
    },
  },
  { timestamps: true }
);

// prevent duplicate swipes
swipeSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

module.exports = mongoose.model("Swipe", swipeSchema);