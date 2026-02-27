// ─── controllers/authController.js ───────────────────────────────────────────
// Handles register and login business logic

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: generate a signed JWT token ──────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                    // payload
    process.env.JWT_SECRET,            // secret from .env
    { expiresIn: process.env.JWT_EXPIRES_IN } // expiry from .env
  );
};

// ── REGISTER ─────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Creates a new user, hashes password via User model pre-save hook
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create user (password hashed automatically in User model)
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err); // pass to global error handler
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Verifies email + password, returns JWT on success
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly include password field (select: false in schema)
    const user = await User.findOne({ email }).select('+password');

    // If user not found OR password doesn't match → same generic error
    // (prevents revealing which field was wrong)
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };