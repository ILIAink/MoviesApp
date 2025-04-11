// import express from "express";
// import { getAllMovies, createMovie } from "../controllers/movieController.js";

// const router = express.Router();

// router.get("/", getAllMovies);
// router.post("/createMovie", createMovie);


// export { router };

import express from "express";
import { fetchAndStoreTitle } from "../controllers/watchmodeController.js";

const router = express.Router();

router.get("/searchTitle", fetchAndStoreTitle);

export { router };
