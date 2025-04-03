import axios from "axios";

const fetchMoviesApp = async (endpoint, method = "GET", data = null) => {
  try {
    const options = {
      method,
      url: `http://localhost:3000/api${endpoint}`,
      ...(data && { data }),
    };

    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error; // Rethrow the error for better handling
  }
};

export { fetchMoviesApp };
