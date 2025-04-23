import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../GlobalContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import {
  addTitleToList,
  searchTitle,
  searchTitleDetails,
  searchTitleSources,
  searchTitleDetailsWithSources,
} from "../../api/endpoints";

const SearchMovies = () => {
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }
      try {
        const data = await searchTitle(query);
        setResults(data.results || []);
      } catch (error) {
        toast.error("Failed to search for titles!");
        console.error(error);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleAddToList = async (title) => {
    try {
      const titleDetails = await searchTitleDetailsWithSources(title.id);
      console.log(titleDetails);
      const addedTitle = await addTitleToList(
        user.user_id,
        title.id,
        titleDetails.type,
        true,
        titleDetails.title,
        titleDetails.genre_names[0],
        titleDetails?.sources[0]?.seasons || 0,
        titleDetails.runtime_minutes || 0,
        titleDetails.release_date,
        titleDetails?.sources || []
      );

      console.log(addedTitle);
      toast.success("Title added to liked list!");
    } catch (error) {
      const message = error.response?.data?.error || "Adding title failed";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-black p-6">
      <div className="max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search for a movie or TV show..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-lg border text-white border-gray-300 mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="grid gap-6">
          {results.map((title) => (
            <div
              key={title.id}
              className="flex bg-white rounded-xl shadow-md overflow-hidden"
            >
              {title.image_url && (
                <img
                  src={title.image_url}
                  alt={title.name}
                  className="w-24 h-36 object-cover"
                />
              )}
              <div className="flex flex-col justify-between p-4 flex-1">
                <div>
                  <h2 className="text-lg font-semibold">{title.name}</h2>
                  <p className="text-gray-500 text-sm">{title.year}</p>
                </div>
                <button
                  onClick={() => handleAddToList(title)}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  Add to My List
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchMovies;
