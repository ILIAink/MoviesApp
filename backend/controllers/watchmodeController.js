// handles fetching from Watchmode API, parsing, and saving into DB

import { searchTitles, getTitleSources } from "../services/watchmode.js";
import { findMovieByTitle, createMovie } from "../db/queries.js";
import { parseWatchmode} from "../utils/parseWatchmode.js"; // helper to convert Watchmode format to DB schema

const fetchAndStoreTitle = async (req, res) => {
  const { query } = req.query;

  if (!query) return res.status(400).json({ error: "Missing search query" });

  try {
    // Check local DB first
    const existing = await findMovieByTitle(query);
    if (existing) {
      return res.status(200).json({ source: "db", data: existing });
    }

    // Fetch from Watchmode second
    const searchResults = await searchTitles(query);
    if (!searchResults?.title_results?.length) {
      return res.status(404).json({ error: "No titles found in Watchmode" });
    }

    const title = searchResults.title_results[0];
    const sources = await getTitleSources(title.id);

    const combined = {    // One object
      ...title,
      sources,
    };

    // Convert data & save to DB
    const dbReady = parseWatchmode(combined);
    const saved = await createMovie(
      dbReady.movie_title,
      dbReady.duration,
      dbReady.release_date,
      dbReady.genre,
      dbReady.age_rating
    );

    res.status(200).json({ source: "watchmode", data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { fetchAndStoreTitle };
