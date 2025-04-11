import express from "express";
import { fetchAndStoreTitle } from "../controllers/watchmodeController.js";

const router = express.Router();

router.get("/searchTitle", fetchAndStoreTitle); // expects ?query=title, e.g. /watchmode/searchTitle?query=inception

export { router };