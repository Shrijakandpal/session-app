import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from './routes/auth.js';
import sessionRoutes from './routes/session.js'


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); 
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.get("/", (req, res) => {
  res.send("Arvyax Wellness Backend is running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
