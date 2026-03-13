const { body } = require("express-validator");
//do validator use kiye hain - validator , second one- express validator

exports.signupValidation = [
  body("firstName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("First name must be 3+ chars"),

  body("email").isEmail().normalizeEmail().withMessage("Invalid email"),

  body("password").isStrongPassword().withMessage("Weak password"),

  body("age")
    .optional({ checkFalsy: true })
    .isInt({ min: 18, max: 100 })
    .withMessage("age must be betweeb 18-100"),

  body("photoUrl").optional().isURL().withMessage("Url is not valid"),
];

exports.profileUpdateValidation = [
  body("firstName")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("First name must be 3+ chars and less than 50 characters"),

  body("lastName")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Last name must be 3+ chars and less than 50 characters"),

  body("age")
    .optional({ checkFalsy: true })
    .isInt({ min: 18, max: 100 })
    .withMessage("age must be between18-100"),
    
    body("gender")
    .optional({ checkFalsy: true }) // Agar khali string "" hai toh ignore karo
    .trim()
    .isIn(["male", "female", "others"]) // Sirf valid values allow karo
    .withMessage("Gender must be male, female, or others"),

  body("photoUrl").optional({ checkFalsy: true }).isURL().withMessage("Url is not valid"),

  body("skills")
    .optional({ checkFalsy: true })
    .isArray({ min: 1, max: 10 })
    .withMessage("NO. of skills should be 10 or less than 10"),

  body("skills.*")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 30 })
    .withMessage("Each skill must be a valid string"),
];


exports.passwordValidation = [
  body("password").exists().withMessage("Password is Required").isStrongPassword().withMessage("Please Enter a Strong password")
]