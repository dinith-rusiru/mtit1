// ─── controllers/userController.js ───────────────────────────────────────────
// Handles user-related routes (all protected — JWT required)

const User = require('../models/User');

// ── GET PROFILE ───────────────────────────────────────────────────────────────
// GET /api/users/profile
// Returns the logged-in user's profile (req.user set by authMiddleware)
const getProfile = async (req, res, next) => {
  try {
    // req.user.id comes from the decoded JWT in authMiddleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id:        user._id,
        name:      user.name,
        email:     user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET ALL USERS ─────────────────────────────────────────────────────────────
// GET /api/users/all
// Returns all users (example of a data endpoint)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-__v');
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, getAllUsers };