import {
  getAllMovies as fetchMovies,
  createMovie as addMovie,
  Like_movie as addMovieLike,
  Like_Show as addShowLike,
  getLikedMovies as fetchLikedMovies,
  getLikedMoviesAndShows as fetchLikedMoviesAndShows,
  getUserServices as fetchUserServices,
  SelectRandMovieFromGivenList as fetchRandomMovie,
  SelectRandShowFromGivenList as fetchRandomShow,
  createService as addService,
  createShow as addShow,
  createEpisode as addEpisode,
  getShowbyID as getShow,
  getMoviebyID as getMovie,
  getServicebyID as getService,
  getSourcesForMovie,
  getSourcesForShow,
  Service_Has_Movie as addMovieToService,
  Service_Has_Season as addShowToService,
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

const addToLikes = async (req, res) => {
  const {
    user_id,
    title_id,
    type,
    watched,
    title_name,
    genre,
    season_count,
    duration,
    release_date,
    sources,
  } = req.body;

  if (!user_id || !title_id || !type) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const normalizedType = type.toLowerCase();

  try {
    console.log("Attempting to add to likes:", {
      user_id,
      title_id,
      type,
      watched,
    });
    const result =
      normalizedType === "movie"
        ? await addMovieLike(user_id, title_id, watched)
        : await addShowLike(user_id, title_id, watched);

    return res.status(201).json(result);
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ error: "You have already added this to your list." });
    }

    try {
      console.log("Adding title:", { title_id, title_name, type });
      const addTitle =
        normalizedType === "movie"
          ? () => addMovie(title_id, title_name, duration, release_date, genre)
          : () => addShow(title_id, title_name, season_count, genre);

      await addTitle();

      // Process each source
      for (const source of sources) {
        const {
          source_id,
          name,
          type: sourceType,
          price,
          region,
          web_url,
        } = source;

        try {
          // Check if service exists
          const service = await getService(source_id);
          if (!service) {
            await addService(source_id, name, 0, 0);
          }

          // Get existing sources to avoid duplicates
          const existingSources =
            normalizedType === "movie"
              ? await getSourcesForMovie(title_id)
              : await getSourcesForShow(title_id);

          const sourceExists = existingSources.some(
            (existing) =>
              existing.service_id === source_id && existing.region === region
          );

          if (!sourceExists) {
            // Set rent_price and buy_price based on source type
            let rent_price = 0;
            let buy_price = 0;

            if (sourceType === "rent") {
              rent_price = parseFloat(price) || 0;
            } else if (sourceType === "buy") {
              buy_price = parseFloat(price) || 0;
            }

            // Add source to title
            if (normalizedType === "movie") {
              await addMovieToService(
                source_id,
                title_id,
                region,
                rent_price,
                buy_price,
                web_url
              );
            } else {
              await addShowToService(
                source_id,
                title_id,
                region,
                rent_price,
                buy_price,
                web_url
              );
            }
          }
        } catch (serviceError) {
          console.error("Error processing source:", serviceError);
        }
      }

      const result =
        normalizedType === "movie"
          ? await addMovieLike(user_id, title_id, watched)
          : await addShowLike(user_id, title_id, watched);

      return res.status(201).json(result);
    } catch (innerError) {
      console.error("Error adding title or like:", innerError);
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

const getUserLikes = async (req, res) => {
  const { user_id } = req.body;
  try {
    const titles = await fetchLikedMoviesAndShows(user_id);
    res.status(200).json(titles);
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

const getTitle = async (req, res) => {
  const { title_id, type } = req.body;

  if (!title_id || !type) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const normalizedType = type.toLowerCase();

  try {
    const title =
      normalizedType === "movie"
        ? await getMovie(title_id)
        : await getShow(title_id);

    // Check if no title was found
    if (!title) {
      return res.status(200).json({ title: null });
    }

    const sources =
      normalizedType === "movie"
        ? await getSourcesForMovie(title_id)
        : await getSourcesForShow(title_id);

    const transformedSources = sources.map((source) => {
      // Create a copy of the source object
      const transformedSource = {
        name: source.name,
        region: source.region,
        web_url: source.web_url,
      };

      // Determine type and price based on rent_price and buy_price
      if (source.rent_price > 0) {
        transformedSource.type = "rent";
        transformedSource.price = source.rent_price.toString();
      } else if (source.buy_price > 0) {
        transformedSource.type = "buy";
        transformedSource.price = source.buy_price.toString();
      } else {
        // If both prices are 0, check if it's a subscription service
        transformedSource.type = "subscription";
        transformedSource.price = "0.00";
      }

      // Add seasons information for shows
      if (normalizedType !== "movie" && source.seasons) {
        transformedSource.seasons = source.seasons;
      }

      return transformedSource;
    });

    // Filter out sources with 0 prices unless they are subscription services
    const filteredSources = transformedSources.filter(
      (source) => source.type === "subscription" || parseFloat(source.price) > 0
    );

    if (normalizedType === "movie") {
      res.status(200).json({
        type: normalizedType,
        title: title.movie_title,
        genre_names: [title.genre],
        runtime_minutes: title.duration,
        release_date: title.release_date,
        sources: filteredSources,
      });
    } else {
      res.status(200).json({
        type: normalizedType,
        title: title.show_name,
        genre_names: [title.genre],
        sources: filteredSources,
      });
    }
  } catch (error) {
    console.error("Error in getTitle:", error);
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllMovies,
  createMovie,
  createShow,
  createEpisode,
  createService,
  addToLikes,
  getUserMovieLikes,
  getUserLikes,
  getUserServices,
  getRandMovieFromList,
  getRandShowFromList,
  getTitle,
};
