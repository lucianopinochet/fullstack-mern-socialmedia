import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();// sets new router

/* READ */
router.get("/", verifyToken, getFeedPosts);// load path with verify and return posts from 'feed' 
router.get("/:userId/posts", verifyToken, getUserPosts);// load path with verify and return posts from a other user

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);// load path with verify and add or remove like from a post

export default router;
