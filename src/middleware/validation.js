const { body, validationResult } = require('express-validator');

/**
 * Validation rules for signup
 */
const signupValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('비밀번호는 최소 8자 이상이어야 합니다')
];

/**
 * Validation rules for login
 */
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요')
];

/**
 * Middleware to check validation results
 */
function checkValidation(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Store errors in a more friendly format
    const errorMessages = errors.array().map(err => err.msg);
    req.validationErrors = errorMessages;
  }

  next();
}

module.exports = {
  signupValidation,
  loginValidation,
  checkValidation
};
