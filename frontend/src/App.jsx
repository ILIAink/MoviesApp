import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import { GlobalProvider } from "./GlobalContext";
import SearchMovies from "./pages/SearchMovies";
import LikedMovies from "./pages/LikedMovies";
import RandomTitle from "./pages/RandomTitle";

const App = () => {
  return (
    <GlobalProvider>
      <div className="h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/searchMovies" element={<SearchMovies />} />
          <Route path="/likedMovies" element={<LikedMovies />} />
          <Route path="/randomTitle" element={<RandomTitle />} />
        </Routes>
        <ToastContainer />
      </div>
    </GlobalProvider>
  );
};
export default App;
