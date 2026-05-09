import { body, query, validationResult } from "express-validator"

export const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((validation)=>
            validation.run(req)
        ));

      const errors = validationResult(req)
      if(errors.isEmpty()){
        return next()
      }

      const firstError = errors.array()[0];
      res.status(400).json({
        message: firstError.msg
      })
    }
};


export const signupValidation = [
    body("fullname").notEmpty().withMessage("fullname is required").trim(),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("mobile")
        .isMobilePhone()
        .withMessage("Valid mobile number is required")
        .isLength({ min: 10, max: 10 }),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];


export const loginValidation = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
]