import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../GlobalContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import {
  addTitleToList,
  searchTitle,
  searchTitleDetailsWithSources,
  doesTitleExist,
} from "../../api/endpoints";

const SearchMovies = () => {
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [titleDetails, setTitleDetails] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("US");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await searchTitle(query);
        setResults(data.results || []);
      } catch (error) {
        toast.error("Failed to search for titles!");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleAddToList = async (title) => {
    try {
      const exists = await doesTitleExist(title.id, title.type);

      let details;
      if (exists.title) {
        // Transform database data to match API format
        details = exists;
        console.log(details);
      } else {
        details = await searchTitleDetailsWithSources(title.id);
      }

      await addTitleToList(
        user.user_id,
        title.id,
        title.type,
        true,
        details.title || details.name,
        details.genre_names?.[0],
        details?.sources?.[0]?.seasons,
        details.runtime_minutes || 0,
        details.release_date,
        details.sources || []
      );
      toast.success("Title added to liked list!");
    } catch (error) {
      const message = error.response?.data?.error || "Adding title failed";
      toast.error(message);
    }
  };

  const handleShowDetails = async (title) => {
    try {
      setIsLoading(true);
      const exists = await doesTitleExist(title.id, title.type);

      let details;
      if (exists.title) {
        // Transform database data to match API format
        details = exists;
      } else {
        details = await searchTitleDetailsWithSources(title.id);
      }

      setSelectedTitle(title);
      setTitleDetails(details);
    } catch (error) {
      toast.error("Failed to fetch title details");
    } finally {
      setIsLoading(false);
    }
  };

  const filterSources = (sources) => {
    if (!sources) return [];

    return sources.filter((source) => {
      // Check if source has all required properties
      if (!source || !source.region || !source.type) return false;

      const priceMatch = source.price > 0;
      const regionMatch = source.region === selectedRegion;
      const typeMatch =
        selectedType === "all"
          ? true // Show all types when "all" is selected
          : source.type.toLowerCase() === selectedType.toLowerCase();

      return regionMatch && typeMatch && priceMatch;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a movie or TV show..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-4 pl-12 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
          <svg
            className="absolute left-4 top-4 h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((title) => (
            <div
              key={title.id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-102 transition duration-200 border border-gray-700 hover:border-blue-500"
            >
              <div className="relative h-64">
                {title.image_url ? (
                  <>
                    {/* Blurred background behind the image */}
                    <div
                      className="absolute inset-0 z-0"
                      style={{
                        backgroundImage: `url(${title.image_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "blur(20px)",
                        transform: "scale(1.1)",
                      }}
                    />

                    {/* Foreground image */}
                    <img
                      src={title.image_url}
                      alt={title.name}
                      className="absolute inset-0 h-full w-full object-contain z-10"
                      loading="lazy"
                    />
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white truncate">
                    {title.name}
                  </h2>
                  <div className="flex space-x-4 mt-2">
                    <span className="text-blue-400">{title.year}</span>
                    <span className="text-gray-400 capitalize">
                      {title.type}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAddToList(title)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200 font-medium"
                  >
                    Add to List
                  </button>
                  <button
                    onClick={() => handleShowDetails(title)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition duration-200 font-medium"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Details Modal */}
        {selectedTitle && titleDetails && (
          <div
            className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedTitle(null);
                setTitleDetails(null);
              }
            }}
          >
            <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-6 space-y-4 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  {selectedTitle.name}
                </h2>
                <button
                  onClick={() => {
                    setSelectedTitle(null);
                    setTitleDetails(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Filters Section */}
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-4">
                {/* Region Selector */}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 whitespace-nowrap">
                    Region:
                  </span>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="bg-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="US">United States</option>
                    <option value="BR">Brazil</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="IN">India</option>
                    <option value="CA">Canada</option>
                    <option value="ES">Spain</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 whitespace-nowrap">Type:</span>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="rent">Rent</option>
                    <option value="buy">Buy</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {/* Title Details */}
                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-700 p-4 rounded-lg">
                  <div className="text-gray-400">Release Date</div>
                  <div className="text-white">
                    {new Date(titleDetails.release_date).toLocaleDateString() ||
                      "N/A"}
                  </div>
                  <div className="text-gray-400">Runtime</div>
                  <div className="text-white">
                    {titleDetails.runtime_minutes
                      ? `${titleDetails.runtime_minutes} minutes`
                      : "N/A"}
                  </div>
                  <div className="text-gray-400">Genres</div>
                  <div className="text-white">
                    {(titleDetails.genre_names || []).join(", ") ||
                      titleDetails.genre ||
                      "No genres available"}
                  </div>
                </div>

                {/* Streaming Sources */}
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Available on:
                  </h3>
                  <div className="space-y-3">
                    {titleDetails?.sources &&
                    filterSources(titleDetails.sources)?.length > 0 ? (
                      filterSources(titleDetails.sources).map(
                        (source, index) => (
                          <div
                            key={`${source.name}-${source.type}-${index}`}
                            className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <div className="flex flex-col">
                              <span className="text-white font-medium">
                                {source.name}
                              </span>
                              <span className="text-gray-400 text-sm capitalize">
                                {source.type}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-green-400 font-medium">
                                ${Number(source.price).toFixed(2)}
                              </span>
                              <a
                                href={source.web_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 font-medium"
                              >
                                Watch
                              </a>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="text-gray-400 text-center py-8">
                        No streaming options available for the selected filters
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMovies;
