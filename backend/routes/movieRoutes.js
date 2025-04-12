import express from "express";
import { getAllMovies, createMovie, addMovieToLikes, getUserMovieLikes } from "../controllers/movieController.js";

const router = express.Router();

router.get("/", getAllMovies);
router.post("/createMovie", createMovie);
router.post("/likeMovie", addMovieToLikes);
router.post("/getMovieLikes", getUserMovieLikes);
export { router };
