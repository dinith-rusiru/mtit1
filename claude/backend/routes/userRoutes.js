// ─── routes/userRoutes.js ─────────────────────────────────────────────────────
// Protected routes — every route here requires a valid JWT token
// The `protect` middleware checks the token before the controller runs

const express                        = require('express');
const { getProfile, getAllUsers }     = require('../controllers/userController');
const protect                        = require('../middleware/authMiddleware');

const router = express.Router();

// All routes below are protected
// GET /api/users/profile  → get logged-in user's profile
router.get('/profile', protect, getProfile);

// GET /api/users/all  → get all users
router.get('/all', protect, getAllUsers);

module.exports = router;