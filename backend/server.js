import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("../.env") });
import cors from "cors";
import express from "express";
import { router as movieRouter } from "./routes/movieRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Needed for frontend interactions

// Routes
app.use("/api/movies", movieRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
