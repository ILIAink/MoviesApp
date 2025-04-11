import { fetchMoviesApp } from "./api";

// Since fetchMoviesApp already throws an error, let it propagate:
const getAllMovies = async () => await fetchMoviesApp("/movies");
const getUser = async (user_name) => {
  await fetchMoviesApp("/user", "POST", { user_name });
};

const createUser = async (user_name, password, user_age) => {
  return await fetchMoviesApp("/user/create", "POST", {
    user_name,
    password,
    user_age,
  });
};

export { getAllMovies, getUser, createUser };
