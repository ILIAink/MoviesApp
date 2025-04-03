import express from "express";
import { getAllMovies, createMovie } from "../controllers/movieController.js";

const router = express.Router();

router.get("/", getAllMovies);
router.post("/createMovie", createMovie);

export { router };
