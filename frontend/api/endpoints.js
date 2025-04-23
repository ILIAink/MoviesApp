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
    search_type: 3, // 3 = search for titles (movies ONLY)  change to 2 for titles or make new function for shows?
  });
};

const searchTitleDetails = async (title_id) => {
  return await fetchWatchMode(`/title/${title_id}/details/`);
};

// USES MORE CREDITS
const searchTitleDetailsWithSources = async (title_id) => {
  return await fetchWatchMode(`/title/${title_id}/details/`, {
    append_to_response: "sources",
  });
};

//search for a Title's sources. optionally, filter by region. if region not specified, all regions from endpoint will be used. 
const searchTitleSources = async (
  title_id, 
  region = undefined // optional
) => {
  return await fetchWatchMode(`/title/${title_id}/sources/`, {
    ...(region && { regions: region }),
  });
};

const listTitlesByGenre = async (
  genre,
) => {
  return await fetchWatchMode(`/list-titles/`, {
    genres: genre,
    sort_by: "popularity_desc"
  });
}; 

const addTitleToList = async (
  user_id,
  title_id,
  type,
  watched = true,
  title_name,
  genre = "Kids",
  season_count,
  duration = 90,
  release_date = "2011-10-16",
) => {
  return await fetchMoviesApp("/movies/addLike", "POST", {
    user_id,
    title_id,
    type,
    watched,
    title_name,
    genre,
    season_count,
    duration,
    release_date
  });
};

const getLikedMovies = async (user_id) => {
  return await fetchMoviesApp("/movies/getmovielikes", "POST", { user_id });
};

const getAllSources = async () => await fetchWatchMode(`/v1/sources/`);

export {
  searchTitleDetails,
  getAllMovies,
  loginUser,
  createUser,
  searchTitle,
  listTitlesByGenre,
  addTitleToList,
  getLikedMovies,
  getAllSources,
  searchTitleSources,
  searchTitleDetailsWithSources,
};
