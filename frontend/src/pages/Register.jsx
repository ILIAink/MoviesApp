import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { createUser } from "../../api/endpoints";
import { useNavigate, Link } from "react-router";
import { GlobalContext } from "../GlobalContext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    age: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, age } = formData;

    if (!username || !password || !age) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const user = await createUser(username, password, Number(age));
      login(user);
      toast.success("Welcome to MoviesApp!");
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.error || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign in here
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="relative">
              <label
                htmlFor="username"
                className="absolute -top-2.5 left-2 px-2 bg-gray-800 text-sm text-purple-400"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-gray-300 
                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-gray-600
                placeholder-gray-500 transition-all duration-300"
                placeholder="Enter username"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="absolute -top-2.5 left-2 px-2 bg-gray-800 text-sm text-purple-400"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-gray-300 
                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-gray-600
                placeholder-gray-500 transition-all duration-300"
                placeholder="Enter password"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="age"
                className="absolute -top-2.5 left-2 px-2 bg-gray-800 text-sm text-purple-400"
              >
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                required
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-gray-300 
                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-gray-600
                placeholder-gray-500 transition-all duration-300"
                placeholder="Enter age"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ease-in-out disabled:opacity-50"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
