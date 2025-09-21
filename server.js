import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import connectDB from "./configuration/database.js";
import authRoutes from "./Routes/authRoute.js";
import imageRoutes from "./Routes/imageRoute.js";
import SeedingUser from "./Seeding/SeedingUser.js";

dotenv.config();
const app = express();


app.use(cors({
	origin: 'https://melody-admin-login.vercel.app',
	methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
}));
app.use(express.json());
// Static file serving removed - files are now stored in Vercel Blob
// app.use("/uploads", express.static("/tmp")); // ❌ REMOVE THIS LINE

connectDB();
if (process.env.NODE_ENV !== 'production') {
  SeedingUser();
}

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Melody Admin Backend' });
});

app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  console.error('Request details:', {
    method: req.method,
    url: req.url,
    body: req.body,
    headers: req.headers
  });

  // Handle multer errors specifically
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 5MB.',
        error: err.message
      });
    }
    return res.status(400).json({
      message: 'File upload error',
      error: err.message
    });
  }

  // Handle custom errors
  if (err.message && err.message.includes('Only images allowed')) {
    return res.status(400).json({
      message: err.message
    });
  }

  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
