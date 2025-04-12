import { fetchMoviesApp, fetchWatchMode } from "./api";

// Since fetchMoviesApp already throws an error, let it propagate:
const getAllMovies = async () => await fetchMoviesApp("/movies");

const createUser = async (username, password, age) => {
  return await fetchMoviesApp("/user/register", "POST", {
    username,
    password,
    age,
  });
};

const loginUser = async (username, password) => {
  return await fetchMoviesApp("/user/login", "POST", {
    username,
    password,
  });
};

const searchTitle = async (title) => {
  return await fetchWatchMode("/autocomplete-search/", {
    search_value: title,
    search_type: 3, // 3 = search for titles (movies ONLY)
  });
};

const searchTitleDetails = async (title_id) => {
  return await fetchWatchMode(`/title/${title_id}/details/`);
};

const addMovieToList = async (
  user_id,
  movie_id,
  movie_title,
  watched = true,
  duration = 90,
  release_date = "2011-10-16",
  genre = "Kids",
  age_rating = "PG-13"
) => {
  return await fetchMoviesApp("/movies/likeMovie", "POST", {
    user_id,
    movie_id,
    watched,
    movie_title,
    duration,
    release_date,
    genre,
    age_rating,
  });
};

const getLikedMovies = async (user_id) => {
  return await fetchMoviesApp("/movies/getmovielikes", "POST", { user_id });
};

export {
  searchTitleDetails,
  getAllMovies,
  loginUser,
  createUser,
  searchTitle,
  addMovieToList,
  getLikedMovies,
};
