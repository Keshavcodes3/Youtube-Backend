import { body, validationResult } from "express-validator";

// Middleware to validate register input
export const validateRegister = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address"),

  body("channelName")
    .notEmpty()
    .withMessage("Please enter a valid channel name"),

  body("phone")
    .notEmpty()
    .withMessage("Phone can't be empty")
    .isMobilePhone()
    .withMessage("Please enter a valid phone number"),

  body("password")
    .notEmpty()
    .withMessage("Password can't be empty")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  // Custom validator for logo file
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ 
        errors: [{ msg: "Logo file is required" }] 
      });
    }

    next();
  },

  // Handle validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    next();
  },
];