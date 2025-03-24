import { pool } from "./index.js";

// Fetch all movies
const getAllMovies = async () => {
  const result = await pool.query("SELECT * FROM movies");
  return result.rows;
};

// Insert a new movie with transactions
const createMovie = async (id, title, releaseYear) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      "INSERT INTO movies (id, title, release_year) VALUES ($1, $2, $3) RETURNING *",
      [id, title, releaseYear]
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Export functions for movies in ES Module syntax
export { getAllMovies, createMovie };
