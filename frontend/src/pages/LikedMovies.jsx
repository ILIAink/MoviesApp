import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../GlobalContext";
import { useNavigate } from "react-router";
import {
  getLikes,
  searchTitleDetailsWithSources,
  doesTitleExist,
} from "../../api/endpoints";
import { toast } from "react-toastify";

const LikedMovies = () => {
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [titleDetails, setTitleDetails] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("US");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchLikedMovies = async () => {
      try {
        const data = await getLikes(user.user_id);
        setMovies(data);
      } catch (error) {
        toast.error("Failed to fetch liked content");
        console.error("Failed to fetch liked movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedMovies();
  }, [user, navigate]);

  const handleShowDetails = async (title) => {
    try {
      setLoading(true);
      const exists = await doesTitleExist(
        title.content_id,
        title.content_type.toLowerCase()
      );

      let details;
      if (exists.title) {
        details = exists;
        console.log(details);
      } else {
        details = await searchTitleDetailsWithSources(title.content_id);
      }

      setSelectedTitle(title);
      setTitleDetails(details);
    } catch (error) {
      toast.error("Failed to fetch title details");
    } finally {
      setLoading(false);
    }
  };

  const filterSources = (sources) => {
    if (!sources) return [];

    return sources.filter((source) => {
      if (!source || !source.region || !source.type) return false;

      const priceMatch = source.price > 0;
      const regionMatch = source.region === selectedRegion;
      const typeMatch =
        selectedType === "all"
          ? true
          : source.type.toLowerCase() === selectedType.toLowerCase();

      return regionMatch && typeMatch && priceMatch;
    });
  };

  const filteredContent = movies.filter((item) =>
    activeFilter === "all"
      ? true
      : item.content_type.toLowerCase() === activeFilter.toLowerCase()
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 md:mb-0">
            My List
          </h1>

          {/* Filter Buttons */}
          <div className="flex space-x-4">
            {["all", "movie", "show"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {filteredContent.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">
              No content in your watchlist yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContent.map((item) => (
              <div
                key={`${item.content_type}-${item.content_id}`}
                className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <div className="p-6 space-y-4">
                  {/* Content Type Badge */}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      item.content_type === "Movie"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {item.content_type}
                  </span>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-white line-clamp-2">
                    {item.title}
                  </h2>

                  {/* Genre */}
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Genre:</span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                      {item.genre}
                    </span>
                  </div>

                  {/* Details Button */}
                  <button
                    onClick={() => handleShowDetails(item)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition duration-200 font-medium"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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
                  {selectedTitle.title}
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
                    {titleDetails.release_date
                      ? new Date(titleDetails.release_date).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="text-gray-400">Runtime</div>
                  <div className="text-white">
                    {titleDetails.runtime_minutes
                      ? `titleDetails.runtime_minutes minutes`
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

export default LikedMovies;
