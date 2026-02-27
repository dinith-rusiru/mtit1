// ─── middleware/authMiddleware.js ─────────────────────────────────────────────
// Protects routes by verifying the JWT token from the Authorization header
// If valid → attaches decoded user to req.user and calls next()
// If invalid/missing → returns 401 Unauthorized

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // ── 1. Get token from header ──────────────────────────────────────────
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1]; // extract token after "Bearer "

    // ── 2. Verify token ───────────────────────────────────────────────────
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const message = err.name === 'TokenExpiredError'
        ? 'Token expired. Please login again.'
        : 'Invalid token.';
      return res.status(401).json({ success: false, message });
    }

    // ── 3. Check user still exists in DB ─────────────────────────────────
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      });
    }

    // ── 4. Attach user to request ─────────────────────────────────────────
    req.user = user; // now available as req.user in controllers
    next();

  } catch (err) {
    next(err);
  }
};

module.exports = protect;