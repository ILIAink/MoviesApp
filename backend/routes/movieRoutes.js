import express from "express";
import { 
    getAllMovies, 
    createMovie, 
    createShow,
    createEpisode,
    createService,
    addMovieToLikes, 
    getUserMovieLikes, 
    getUserServices,
    getRandMovieFromList,
    getRandShowFromList,
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/", getAllMovies);
router.post("/createMovie", createMovie);
router.post("/createShow", createShow);
router.post("/createEpisode", createEpisode);
router.post("/createService", createService);
router.post("/likeMovie", addMovieToLikes);
router.post("/getMovieLikes", getUserMovieLikes);
router.post("/getUserServices", getUserServices);
router.post("/getRandMovieFromList", getRandMovieFromList);
router.post("/getRandShowFromList", getRandShowFromList);

export { router };
