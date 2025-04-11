import express from "express";
import { getUser, createUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/", getUser);
router.post("/create", createUser);

export { router };
