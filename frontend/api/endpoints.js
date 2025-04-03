import { fetchMoviesApp } from "./api";

const getAllMovies = async () => {
  try {
    const response = await fetchMoviesApp("/movies");
    return response;
  } catch (error) {
    console.error("Error fetching, getALlMovies endpoint:", error);
  }
};

export { getAllMovies };
