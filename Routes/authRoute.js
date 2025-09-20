import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";

const router = express.Router();

// Register photographer (one-time setup)
// router.post("/register", async (req, res) => {
//   const { email, password } = req.body;
//   const passwordHash = await bcrypt.hash(password, 10);
//   const user = new User({ email, passwordHash });
//   await user.save();
//   res.json({ message: "User registered" });
// });

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ token });
});

export default router;
