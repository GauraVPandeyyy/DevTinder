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
      min: [18, "Age must be at least 18"],
      max: [100, "Age cannot exceed 100"],
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
      default: "https://github.com/shadcn.png",
    },

    about: {
      type: String,
      maxlength: [500, "About section cannot exceed 500 characters"],
      default: "Hello World! I'm passionate about coding and always eager to learn new technologies and build cool stuff.",
    },
    jobTitle: {
      type: String,
      default: "Software Engineer",
      trim: true,
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
