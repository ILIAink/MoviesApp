import { fetchMoviesApp } from "./api";

// Since fetchMoviesApp already throws an error, let it propagate:
const getAllMovies = async () => fetchMoviesApp("/movies");

export { getAllMovies };
