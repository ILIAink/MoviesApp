import fetch from "node-fetch";
import { WATCHMODE_API_KEY } from "../db/index.js";

const BASE_URL = "https://api.watchmode.com/v1";

// Returns JSON object of movies/shows: BASE URL + API key + search query
export const searchTitles = async (query) => {
  const res = await fetch(`${BASE_URL}/search/?apiKey=${WATCHMODE_API_KEY}&search_value=${encodeURIComponent(query)}&search_type=2`);
  return res.json();
};

// Retrieves streaming platform info based on given movie/show title
export const getTitleSources = async (titleId) => {
  const res = await fetch(`${BASE_URL}/title/${titleId}/sources/?apiKey=${WATCHMODE_API_KEY}`);
  return res.json();
};
