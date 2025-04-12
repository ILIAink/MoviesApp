import { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUser } from "../../api/endpoints";
import { useNavigate } from "react-router";
import { GlobalContext } from "../GlobalContext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    age: "",
  });
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const { login } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    const { username, password, age } = formData;
    setLoading(true);
    try {
      const user = await createUser(username, password, Number(age));
      login(user);
      toast.success("User registered successfully!");

      setRedirecting(true);
      setTimeout(() => {
        navigate("/");
      }, 3000); // wait 3 second before navigating
    } catch (error) {
      const message = error.response?.data?.error || "Registration failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-center p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Register</h1>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="border p-2 rounded w-64"
        disabled={loading}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="border p-2 rounded w-64"
        disabled={loading}
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        className="border p-2 rounded w-64"
        disabled={loading}
      />

      <button
        onClick={handleRegister}
        disabled={loading}
        className={`mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {redirecting && (
        <div className="flex items-center mt-4 space-x-2 text-green-500">
          <svg
            className="animate-spin h-5 w-5 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3 3-3h-4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
            ></path>
          </svg>
          <span>Redirecting...</span>
        </div>
      )}
    </div>
  );
};

export default Register;
