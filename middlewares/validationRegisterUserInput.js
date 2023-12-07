const { validationResult, body } = require("express-validator");

function validateRegisterUserInput(req, res, next) {
  const validationRules = [
    body("name")
      .notEmpty()
      .isLength({ min: 3, max: 255 })
      .withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("contact")
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Contact number must be 10 digits"),
  ];

  for (const rule of validationRules) {
    rule(req);
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}

module.exports = validateRegisterUserInput;
