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

//Create a show
const createShow = async (
    Show_name,
    Season_count,
    Genre,
    Age_rating
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // RETURNING * just gives us back the newly created movie to see if everything worked as expected
    const result = await client.query(
        "INSERT INTO show (Show_name, Season_count, Genre, Age_rating) VALUES ($1, $2, $3, $4) RETURNING *",
        [Show_name, Season_count, Genre, Age_rating]
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


//Get a user's liked movies
const getLikedMovies = async (
    user_id
) => {
  const result = await pool.query(
      "SELECT * FROM Movie WHERE Movie_id IN (SELECT Movie_id FROM Likes_Movie WHERE Users_id = $1)",
      [user_id]
  );
  return result.rows;
};


//get a users liked shows
const getLikedShow = async (
    user_id
) => {
  const result = await pool.query(
      "SELECT * FROM Show WHERE Show_id IN (SELECT Show_id FROM Likes_Show WHERE Users_id = $1)",
      [user_id]
  );
  return result.rows;
};


// Export functions for movies in ES Module syntax
export { getAllMovies, createMovie, getLikedMovies, getLikedShow, createShow};
