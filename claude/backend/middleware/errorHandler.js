// ─── middleware/errorHandler.js ───────────────────────────────────────────────
// Global error handler — catches all errors passed via next(err)
// Must be the LAST middleware in server.js

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Server Error';

  // Mongoose duplicate key error (e.g. email already exists)
  if (err.code === 11000) {
    statusCode = 409;
    message    = `${Object.keys(err.keyValue)[0]} already exists`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message    = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  // Log error in development only
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR:', err.stack);
  }

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;