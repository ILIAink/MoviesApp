import pg from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("../.env") });
const { Pool } = pg;

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Export Watchmode API key
const WATCHMODE_API_KEY = process.env.WATCHMODE_API_KEY;

export { pool, WATCHMODE_API_KEY };
