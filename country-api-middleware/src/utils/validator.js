const { body, validationResult } = require('express-validator');

// Password requirements constants (reusable)
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  minUppercase: 1,
  minLowercase: 1,
  minNumbers: 1,
  minSymbols: 1
};

const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Only letters, numbers and underscores allowed'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
    
  body('password')
    .isLength({ min: PASSWORD_REQUIREMENTS.minLength })
    .withMessage(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`)
    .matches(/[A-Z]/).withMessage(`Requires ${PASSWORD_REQUIREMENTS.minUppercase} uppercase letter`)
    .matches(/[a-z]/).withMessage(`Requires ${PASSWORD_REQUIREMENTS.minLowercase} lowercase letter`)
    .matches(/[0-9]/).withMessage(`Requires ${PASSWORD_REQUIREMENTS.minNumbers} number`)
    .matches(/[^A-Za-z0-9]/).withMessage(`Requires ${PASSWORD_REQUIREMENTS.minSymbols} special character`)
];

const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password required')
];

const validateKeyCreation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Key name must be 3-50 characters')
];

// Enhanced error formatter
const formatValidationError = (errors) => {
  return {
    status: 'error',
    code: 'VALIDATION_FAILED',
    message: 'Validation failed',
    details: errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value || undefined
    }))
  };
};

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(formatValidationError(errors));
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateKeyCreation,
  validateRequest,
  PASSWORD_REQUIREMENTS // Exporting if needed elsewhere
};