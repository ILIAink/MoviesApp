import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../GlobalContext";
import { useNavigate } from "react-router";
import { getLikedMovies } from "../../api/endpoints";

const LikedMovies = () => {
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchLikedMovies = async () => {
      try {
        const data = await getLikedMovies(user.user_id);
        console.log(data);
        setMovies(data);
      } catch (error) {
        console.error("Failed to fetch liked movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedMovies();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Liked Movies</h1>
      {movies.length === 0 ? (
        <p className="text-gray-500">You have no liked movies yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.movie_id}
              className="border rounded-2xl p-4 shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                {movie.movie_title}
              </h2>
              <p className="text-gray-600">Duration: {movie.duration} min</p>
              <p className="text-gray-600">
                Release Date: {movie.release_date}
              </p>
              <p className="text-gray-600">Genre: {movie.genre}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedMovies;
