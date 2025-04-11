import { fetchMoviesApp } from "./api";

// Since fetchMoviesApp already throws an error, let it propagate:
const getAllMovies = async () => await fetchMoviesApp("/movies");
const getUser = async (user_name) => {
  await fetchMoviesApp("/user", "POST", { user_name });
};

const createUser = async (username, password, age) => {
  return await fetchMoviesApp("/user/register", "POST", {
    username,
    password,
    age,
  });
};

export { getAllMovies, getUser, createUser };
