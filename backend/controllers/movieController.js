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
  const { user_id, movie_id, watched } = req.body;
  // try adding a movie to likes_movie table... if error (movie_id not in movies table) add it to movies table and then try again
  try {
    const result = await addLike(user_id, movie_id, watched);
    res.status(201).json(result);
  } catch (error) {
    // im assuming the error is due to the movie_id not being in the movies table, not the user_id lol
    const { movie_title, duration, release_date, genre, age_rating } = req.body;
    const movie = await addMovie(
      movie_id,
      movie_title,
      duration,
      release_date,
      genre,
      age_rating
    );
    // now trying again...
    console.log(movie);
    try {
      const result = await addLike(user_id, movie_id, watched);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message }); // idk if this is the best error code cause idk what error could happen atp
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
