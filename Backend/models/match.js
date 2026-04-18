const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// ensure unique pair
matchSchema.index(
  { "users.0": 1, "users.1": 1 },
  { unique: true }
);

module.exports = mongoose.model("Match", matchSchema);