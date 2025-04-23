import {
  getAllMovies as fetchMovies,
  createMovie as addMovie,
  Like_movie as addLike,
  getLikedMovies as fetchLikedMovies,
  getUserServices as fetchUserServices,
  SelectRandMovieFromGivenList as fetchRandomMovie,
  SelectRandShowFromGivenList as fetchRandomShow,
  createService as addService,
  createShow as addShow,
  createEpisode as addEpisode,
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
  const { movie_id, movie_title, duration, release_date, genre } = req.body;
  try {
    const newMovie = await addMovie(
      movie_id,
      movie_title,
      duration,
      release_date,
      genre
    );

    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createShow = async (req, res) => {
  const { show_id, show_name, season_count, genre } = req.body;
  try {
    const newShow = await addShow(show_id, show_name, season_count, genre);

    res.status(201).json(newShow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEpisode = async (req, res) => {
  const { show_id, season_number, episode_number, episode_name, duration } =
    req.body;
  try {
    const newEpisode = await addEpisode(
      show_id,
      season_number,
      episode_number,
      episode_name,
      duration
    );
    res.status(201).json(newEpisode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createService = async (req, res) => {
  const {
    service_id, //this is source_id in watchmode
    service_name,
  } = req.body;
  try {
    const newService = await addService(
      service_id,
      service_name,
      0, //watchmode doesnt give price info for sources, just rent buy price for sources for a title i think
      0
    );

    res.status(201).json(newService);
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
      await addMovie(movie_id, movie_title, duration, release_date, genre);

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

const getUserServices = async (req, res) => {
  const { user_id } = req.body;
  try {
    const services = await fetchUserServices(user_id);
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// jimmy's query uses some a given list to select some random movie
// i think the list would come from the v/list-titles endpoint filtered by a
// genre the user has selected? as described in the feature list
const getRandMovieFromList = async (req, res) => {
  const { list } = req.body;
  try {
    const randomMovie = await fetchRandomMovie(list);
    res.status(200).json(randomMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRandShowFromList = async (req, res) => {
  const { list } = req.body;
  try {
    const randomShow = await fetchRandomShow(list);
    res.status(200).json(randomShow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllMovies,
  createMovie,
  createShow,
  createEpisode,
  createService,
  addMovieToLikes,
  getUserMovieLikes,
  getUserServices,
  getRandMovieFromList,
  getRandShowFromList,
};
