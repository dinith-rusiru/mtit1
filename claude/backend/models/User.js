// ─── models/User.js ──────────────────────────────────────────────────────────
// Mongoose schema for users collection
// Password is hashed automatically before saving via pre-save hook

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,      // no duplicate emails in DB
      lowercase: true,      // always store as lowercase
      trim:      true,
    },
    password: {
      type:     String,
      required: [true, 'Password is required'],
      minlength: 6,
      select:   false,      // never return password in queries by default
    },
  },
  { timestamps: true }      // adds createdAt and updatedAt fields
);

// ── Hash password before saving to DB ────────────────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // only hash if password changed
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Method to compare login password with stored hash ────────────────────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);