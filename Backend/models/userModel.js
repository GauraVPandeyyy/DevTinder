const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    membershipType: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    lastSeen: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },

    photoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon.jpg",
    },

    about: {
      type: String,
      maxlength: 500,
      default: "There is nothing about this person",
    },

    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

// 🔐 AUTO HASH PASSWORD
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// 🔑 COMPARE PASSWORD
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// 🎫 GENERATE JWT
userSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
};

module.exports = mongoose.model("User", userSchema);
