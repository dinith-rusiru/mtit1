// ─── server.js ───────────────────────────────────────────────────────────────
// Entry point: loads env, connects MongoDB, starts Express server


const cors = require("cors");
app.use(cors());

require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Import error handler middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json()); // parse incoming JSON body

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);  // /api/auth/register  /api/auth/login
app.use('/api/users', userRoutes); // /api/users/profile  (protected)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

// ── Global error handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ── Connect MongoDB then start server ────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });