import {
  getAllMovies as fetchMovies,
  createMovie as addMovie,

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
  const { movie_id, movie_title, duration, release_date, genre, age_rating } = req.body;
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

export { getAllMovies, createMovie };
