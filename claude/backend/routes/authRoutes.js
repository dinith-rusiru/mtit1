// ─── routes/authRoutes.js ─────────────────────────────────────────────────────
// Public routes: register + login
// Includes input validation using express-validator

const express                     = require('express');
const { body, validationResult }  = require('express-validator');
const { register, login }         = require('../controllers/authController');

const router = express.Router();

// ── Validation middleware ─────────────────────────────────────────────────────
// Checks validation results and returns 422 if anything failed
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
    });
  }
  next();
};

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register    // → controllers/authController.js
);

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login       // → controllers/authController.js
);

module.exports = router;