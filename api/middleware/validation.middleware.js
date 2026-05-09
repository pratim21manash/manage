import { body, query, validationResult } from "express-validator";

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const firstError = errors.array()[0];
    res.status(400).json({
      message: firstError.msg,
    });
  };
};

const signupValidation = [
  body("fullname").notEmpty().withMessage("Fullname is required").trim(),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("mobile")
    .isMobilePhone()
    .withMessage("Valid mobile number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be 10 digits"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const taskValidation = [
  body("title").notEmpty().withMessage("Title is required").trim(),
  body("description").notEmpty().withMessage("Description is required").trim(),
  body("assignedTo")
    .notEmpty()
    .withMessage("Assigned user is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
];

// Fix: Made status optional so admin can update other fields
const taskStatusValidation = [
  body("status")
    .optional()
    .isIn(["pending", "in_progress", "completed"])
    .withMessage("Invalid status"),
];

const paginationValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
];

const taskFiltersValidation = [
  query("status").optional().isIn(["pending", "in_progress", "completed"]).withMessage("Invalid status"),
  query("assignedTo").optional().isMongoId().withMessage("Invalid user ID"),
  ...paginationValidation,
];

export {
  validate,
  signupValidation,
  loginValidation,
  taskValidation,
  taskStatusValidation,
  taskFiltersValidation,
};