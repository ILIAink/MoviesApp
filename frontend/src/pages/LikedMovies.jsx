import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../GlobalContext";
import { useNavigate } from "react-router";
import { getLikes } from "../../api/endpoints";
import { toast } from "react-toastify";

const LikedMovies = () => {
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedMovies;
