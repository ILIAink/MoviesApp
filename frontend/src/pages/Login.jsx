import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUser } from "../../api/endpoints";

const Login = () => {
  const [user_name, setUsername] = useState("");

  const handleLogin = async () => {
    try {
      await getUser(user_name);
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <input
        type="text"
        placeholder="Username"
        className="input mb-4"
        value={user_name}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
