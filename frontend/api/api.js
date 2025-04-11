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
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error(
        "Error Response:",
        error.response.data,
        "Status:",
        error.response.status,
        "Headers:",
        error.response.headers
      );
    } else if (error.request) {
      // Request was made but no response received
      console.error("No Response:", error.request);
    } else {
      // Something else happened
      console.error("Error Message:", error.message);
    }
    throw error;
  }
};

export { fetchMoviesApp };
