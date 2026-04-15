const { body } = require("express-validator");


// ================= SIGNUP =================
exports.signupValidation = [
  body("firstName")
    .trim()
    .notEmpty().withMessage("First name is required")
    .isLength({ min: 3 }).withMessage("First name must be at least 3 characters"),

  body("lastName")
    .optional({checkFalsy : true})
    .trim()
    .isLength({ min: 3 }).withMessage("Last name must be at least 3 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isStrongPassword().withMessage("Password must be strong"),

  body("age")
    .optional()
    .isInt({ min: 18, max: 100 })
    .withMessage("Age must be between 18-100"),

  body("gender")
    .optional()
    .isIn(["male", "female", "others"])
    .withMessage("Invalid gender"),

  body("photoUrl")
    .optional()
    .isURL().withMessage("Invalid URL"),

  body("skills")
    .optional()
    .isArray({ max: 10 })
    .withMessage("Maximum 10 skills allowed"),

  body("skills.*")
    .optional()
    .isString()
    .trim()
    .notEmpty().withMessage("Skill cannot be empty")
    .isLength({ min: 2, max: 30 })
    .withMessage("Skill must be 2-30 characters"),
];


// ================= PROFILE UPDATE =================
exports.profileUpdateValidation = [

  body("firstName")
    .trim()
    .notEmpty().withMessage("First name cannot be empty")
    .isLength({ min: 3, max: 50 }),

  body("lastName")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 50 }),

  body("age")
    .optional({ checkFalsy: true })
    .isInt({ min: 18, max: 100 })
    .withMessage("Age must be between 18-100")
    .toInt(),

  body("gender")
    .optional()
    .isIn(["male", "female", "others"])
    .withMessage("Invalid gender"),

  body("about")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("About cannot exceed 500 characters"),

  body("jobTitle") // ✅ NEW
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Job title must be 2-50 characters"),

  body("skills")
    .optional()
    .isArray({ max: 10 })
    .withMessage("Max 10 skills allowed"),

  body("skills.*")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 30 })
    .withMessage("Each skill must be 2-30 characters"),
];


// ================= PASSWORD UPDATE =================
exports.passwordValidation = [
  body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isStrongPassword().withMessage("Password must be strong"),
];