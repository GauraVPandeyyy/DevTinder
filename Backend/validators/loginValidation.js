const { body } = require("express-validator");

exports.loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required"),
];