import {
  getAllMovies as fetchMovies,
  createMovie as addMovie,
} from "../db/queries.js";

const getAllMovies = async (req, res) => {
  try {
    const movies = await fetchMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMovie = async (req, res) => {
  const { id, title, release_year } = req.body;
  try {
    const newMovie = await addMovie(id, title, release_year);
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getAllMovies, createMovie };
