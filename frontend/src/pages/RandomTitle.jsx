import { useContext, useState } from "react";
import { GlobalContext } from "../GlobalContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { fetchWatchMode } from "../../api/api";
import {
  addTitleToList,
  searchTitleDetailsWithSources,
} from "../../api/endpoints";

const serviceNameToId = {
  Netflix: 203,
  Hulu: 157,
  Max: 387,
  "Prime Video": 26,
  "Disney+": 372,
  "AppleTV+": 371,
  "BBC iPlayer": 409,
  "Paramount+": 444,
  Showtime: 248,
  Peacock: 388,
  STARZ: 232,
  Plex: 439,
};

const RandomTitle = () => {
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    types: [],
    genres: "",
    source_types: [],
    source_ids: [],
    regions: "US",
    sort_by: "popularity_desc",
  });
  const [randomTitle, setRandomTitle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const typeOptions = [
    { value: "movie", label: "Movies" },
    { value: "tv_series", label: "TV Series" },
  ];

  const sourceTypeOptions = [
    { value: "sub", label: "Subscription" },
    { value: "rent", label: "Rent" },
    { value: "buy", label: "Buy" },
  ];

  const serviceOptions = Object.entries(serviceNameToId).map(([name, id]) => ({
    value: id.toString(),
    label: name,
  }));

  const genreOptions = [
    { value: "1", label: "Action" },
    { value: "39", label: "Action & Adventure" },
    { value: "30", label: "Adult" },
    { value: "2", label: "Adventure" },
    { value: "3", label: "Animation" },
    { value: "33", label: "Anime" },
    { value: "31", label: "Biography" },
    { value: "4", label: "Comedy" },
    { value: "5", label: "Crime" },
    { value: "6", label: "Documentary" },
    { value: "7", label: "Drama" },
    { value: "8", label: "Family" },
    { value: "9", label: "Fantasy" },
    { value: "34", label: "Food" },
    { value: "28", label: "Game Show" },
    { value: "10", label: "History" },
    { value: "11", label: "Horror" },
    { value: "21", label: "Kids" },
    { value: "12", label: "Music" },
    { value: "32", label: "Musical" },
    { value: "13", label: "Mystery" },
    { value: "36", label: "Nature" },
    { value: "22", label: "News" },
    { value: "23", label: "Reality" },
    { value: "14", label: "Romance" },
    { value: "40", label: "Sci-Fi & Fantasy" },
    { value: "15", label: "Science Fiction" },
    { value: "25", label: "Soap" },
    { value: "29", label: "Sports" },
    { value: "37", label: "Supernatural" },
    { value: "26", label: "Talk" },
    { value: "17", label: "Thriller" },
    { value: "35", label: "Travel" },
    { value: "38", label: "TV Movie" },
    { value: "18", label: "War" },
    { value: "41", label: "War & Politics" },
    { value: "19", label: "Western" },
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const getRandomTitle = async () => {
    try {
      setIsLoading(true);
      const params = {
        types: filters.types.join(","),
        genres: filters.genres,
        source_types: filters.source_types.join(","),
        source_ids: filters.source_ids.join(","),
        regions: filters.regions,
        sort_by: filters.sort_by,
        limit: 250,
      };

      const response = await fetchWatchMode("/list-titles/", params);
      if (response.titles && response.titles.length > 0) {
        const randomIndex = Math.floor(Math.random() * response.titles.length);
        const selectedTitle = response.titles[randomIndex];
        const details = await searchTitleDetailsWithSources(selectedTitle.id);
        setRandomTitle(details);
      } else {
        toast.error("No titles found with these filters!");
      }
    } catch (error) {
      toast.error("Failed to fetch random title!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToList = async () => {
    if (!randomTitle) return;

    try {
      await addTitleToList(
        user.user_id,
        randomTitle.id,
        randomTitle.type,
        true,
        randomTitle.title,
        randomTitle.genre_names[0],
        randomTitle?.sources?.[0]?.seasons || 0,
        randomTitle.runtime_minutes || 0,
        randomTitle.release_date,
        randomTitle.sources || []
      );
      toast.success("Title added to liked list!");
    } catch (error) {
      toast.error("Failed to add title to list!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white text-center">
          Random Title Generator
        </h1>

        {/* Filters Section */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Content Type Filter */}
              <div className="space-y-2">
                <label className="text-white font-medium">Content Type</label>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        const newTypes = filters.types.includes(type.value)
                          ? filters.types.filter((t) => t !== type.value)
                          : [...filters.types, type.value];
                        handleFilterChange("types", newTypes);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.types.includes(type.value)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Type Filter */}
              <div className="space-y-2">
                <label className="text-white font-medium">Source Type</label>
                <div className="flex flex-wrap gap-2">
                  {sourceTypeOptions.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        const newTypes = filters.source_types.includes(
                          type.value
                        )
                          ? filters.source_types.filter((t) => t !== type.value)
                          : [...filters.source_types, type.value];
                        handleFilterChange("source_types", newTypes);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.source_types.includes(type.value)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Genre Filter */}
              <div className="space-y-2">
                <label className="text-white font-medium">Genre</label>
                <select
                  value={filters.genres}
                  onChange={(e) => handleFilterChange("genres", e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Genres</option>
                  {genreOptions.map((genre) => (
                    <option key={genre.value} value={genre.value}>
                      {genre.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Streaming Services Filter */}
              <div className="space-y-2">
                <label className="text-white font-medium">
                  Streaming Services
                </label>
                <div className="flex flex-wrap gap-2">
                  {serviceOptions.map((service) => (
                    <button
                      key={service.value}
                      onClick={() => {
                        const newServices = filters.source_ids.includes(
                          service.value
                        )
                          ? filters.source_ids.filter(
                              (s) => s !== service.value
                            )
                          : [...filters.source_ids, service.value];
                        handleFilterChange("source_ids", newServices);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.source_ids.includes(service.value)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {service.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={getRandomTitle}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Get Random Title"}
          </button>
        </div>

        {/* Results Section */}
        {randomTitle && (
          <div className="bg-gray-800 rounded-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {randomTitle.poster && (
                <img
                  src={randomTitle.poster}
                  alt={randomTitle.title}
                  className="w-full md:w-64 h-96 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-bold text-white">
                  {randomTitle.title}
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-400">Release Date</div>
                  <div className="text-white">
                    {new Date(randomTitle.release_date).toLocaleDateString()}
                  </div>
                  <div className="text-gray-400">Runtime</div>
                  <div className="text-white">
                    {randomTitle.runtime_minutes} minutes
                  </div>
                  <div className="text-gray-400">Genres</div>
                  <div className="text-white">
                    {randomTitle.genre_names.join(", ")}
                  </div>
                  {randomTitle.sources && randomTitle.sources.length > 0 && (
                    <>
                      <div className="text-gray-400">Available on</div>
                      <div className="text-white">
                        {randomTitle.sources
                          .map((source) => source.name)
                          .join(", ")}
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={handleAddToList}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Add to My List
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomTitle;
