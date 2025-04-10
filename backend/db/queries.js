import { pool } from "./index.js";

// Fetch all movies
const getAllMovies = async () => {
  const result = await pool.query("SELECT * FROM movie");
  return result.rows;
};

// Insert a new movie with transactions
const createMovie = async (
  movie_title,
  duration,
  release_date,
  genre,
  age_rating
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // RETURNING * just gives us back the newly created movie to see if everything worked as expected
    const result = await client.query(
      "INSERT INTO movie (movie_title, duration, release_date, genre, age_rating) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [movie_title, duration, release_date, genre, age_rating]
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

// Create new user with username, password, & age
const registerUser = async (username, hashedPassword, age) => {
  const result = await pool.query(
    `INSERT INTO users (user_name, password, user_age)
     VALUES ($1, $2, $3)
     RETURNING user_id, user_name, user_age`,
    [username, hashedPassword, age]
  );
  return result.rows[0];
};

// Find user by username
const findUserByUsername = async (username) => {
  const result = await pool.query(`SELECT * FROM users WHERE user_name = $1`, [username]);
  return result.rows[0];
};

export { registerUser, findUserByUsername };