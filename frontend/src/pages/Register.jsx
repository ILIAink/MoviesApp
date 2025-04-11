import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUser } from "../../api/endpoints";

const Register = () => {
  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user_age, setUserAge] = useState("");

  const handleRegister = async () => {
    try {
      const user = await createUser(user_name, password, Number(user_age));
      console.log("hi");
      console.log(user);
      toast.success("User registered successfully!");
    } catch (error) {
      const message = error.response?.data?.error || "Registration failed.";
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-center p-4">
      <div className="bg-gray-800 p-10 rounded-sm flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-6">Register</h1>
        <input
          type="text"
          placeholder="Username"
          className="input mb-4 p-4 outline outline-gray-400 rounded-sm"
          value={user_name}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input mb-4 p-4 outline outline-gray-400 rounded-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          className="input mb-6 p-4 outline outline-gray-400 rounded-sm"
          value={user_age}
          onChange={(e) => setUserAge(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;

// Remember to define/createUser somewhere above or import it
