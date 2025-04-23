import express from "express";
import { 
    getAllMovies, 
    createMovie, 
    createShow,
    createEpisode,
    createService,
    addToLikes, 
    getUserMovieLikes, 
    getUserServices,
    getRandMovieFromList,
    getRandShowFromList,
    getTitle
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/", getAllMovies);
router.post("/createMovie", createMovie);
router.post("/createShow", createShow);
router.post("/createEpisode", createEpisode);
router.post("/createService", createService);
router.post("/addLike", addToLikes);
router.post("/getMovieLikes", getUserMovieLikes);
router.post("/getUserServices", getUserServices);
router.post("/getRandMovieFromList", getRandMovieFromList);
router.post("/getRandShowFromList", getRandShowFromList);
router.post("/getTitle", getTitle);

export { router };
