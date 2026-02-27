require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");

const app = express();
const cors = require("cors");
app.use(cors());

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Public auth routes
app.use("/api/auth", authRoutes);

// Example protected route
app.get("/api/protected", protect, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed",
    user: req.user,
  });
});
app.get("/", (req, res) => {
  res.send("Server working");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));