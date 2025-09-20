import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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
app.use("/uploads", express.static("uploads"));

connectDB();
SeedingUser();


app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
