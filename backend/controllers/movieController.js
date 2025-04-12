import {
  getAllMovies as fetchMovies,
  createMovie as addMovie,
  Like_movie as addLike,
  getLikedMovies as fetchLikedMovies,
} from "../db/queries.js";

const getAllMovies = async (req, res) => {
  try {
    const movies = await fetchMovies();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMovie = async (req, res) => {
  const { movie_id, movie_title, duration, release_date, genre, age_rating } =
    req.body;
  try {
    const newMovie = await addMovie(
      movie_id,
      movie_title,
      duration,
      release_date,
      genre,
      age_rating
    );

    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addMovieToLikes = async (req, res) => {
  const {
    user_id,
    movie_id,
    watched,
    movie_title,
    duration,
    release_date,
    genre,
    age_rating,
  } = req.body;

  try {
    // Try adding the like first
    const result = await addLike(user_id, movie_id, watched);
    return res.status(201).json(result);
  } catch (error) {
    if (error.code === "23505") {
      // Unique constraint violation — already liked
      return res
        .status(400)
        .json({ error: "You have already added this to your list..." });
    }

    try {
      // Assume error because movie doesn't exist yet, so add movie first
      await addMovie(
        movie_id,
        movie_title,
        duration,
        release_date,
        genre,
        age_rating
      );

      // After adding the movie, try adding the like again
      const result = await addLike(user_id, movie_id, watched);
      return res.status(201).json(result);
    } catch (innerError) {
      // If adding the movie or liking it again fails
      console.error(innerError);
      return res
        .status(500)
        .json({ error: "An unexpected error occurred. Please try again." });
    }
  }
};

const getUserMovieLikes = async (req, res) => {
  const { user_id } = req.body;
  try {
    const movies = await fetchLikedMovies(user_id);
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export { getAllMovies, createMovie, addMovieToLikes, getUserMovieLikes };
