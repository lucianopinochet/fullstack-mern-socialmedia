import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();// sets new router

router.post("/login", login); // route to login with path "/login"

export default router;
