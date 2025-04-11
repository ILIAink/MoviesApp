import { useState, useEffect } from "react";
import { getAllMovies } from "../api/endpoints"; // Import your function

function App() {
  const [movies, setMovies] = useState([]); // Keeps track of state, re-renders the website if there are changes

  const fetchAndSetMovies = async () => {
    try {
      const data = await getAllMovies();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Only calls the API once when the page/component mounts (loads)
  useEffect(() => {
    fetchAndSetMovies();
  }, []);

  return (
    <div className="h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Movie List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {movies.map((movie) => (
          <div
            key={movie.movie_id}
            className="bg-gray-800 p-4 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold">{movie.movie_title}</h2>
            <p className="text-sm text-gray-400">{movie.genre}</p>
            <p className="text-sm">Duration: {movie.duration} mins</p>
            <p className="text-sm">Age Rating: {movie.age_rating}</p>
            <p className="text-sm">
              Release Date: {new Date(movie.release_date).toDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
