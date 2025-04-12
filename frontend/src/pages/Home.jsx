import { useContext } from "react";
import { GlobalContext } from "../GlobalContext";
import { useNavigate } from "react-router";

const Home = () => {
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl">Welcome to the MOVIES APP!!!</h1>
      {user && (
        <div>
          <button
            onClick={() => navigate("/searchMovies")}
            className="bg-purple-400 p-4 mt-4 cursor-pointer rounded-sm"
          >
            Search Movies
            {/* {import.meta.env.VITE_WATCHMODE_API} */}
          </button>
        </div>
      )}
    </div>
  );
};
export default Home;
