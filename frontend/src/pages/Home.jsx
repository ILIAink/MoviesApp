import { useContext } from "react";
import { GlobalContext } from "../GlobalContext";
import { useNavigate } from "react-router";

const Home = () => {
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Welcome to Entertainment Vault
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your ultimate destination for discovering and tracking your
              favorite movies and shows!
            </p>
          </div>

          {/* Main Content */}
          {user ? (
            <div className="flex flex-col items-center space-y-6">
              <p className="text-lg text-purple-300">
                Welcome back, {user.user_name}!
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/searchMovies")}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 transition-colors duration-300 
                    rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 flex items-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Search Movies</span>
                </button>
                <button
                  onClick={() => navigate("/likedMovies")}
                  className="px-8 py-4 bg-transparent border-2 border-purple-500 hover:bg-purple-500/20 
                    transition-colors duration-300 rounded-lg font-semibold flex items-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  <span>My Watchlist</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <p className="text-lg text-gray-300">
                Sign in to start tracking your favorite movies
              </p>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 transition-colors duration-300 
                  rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
