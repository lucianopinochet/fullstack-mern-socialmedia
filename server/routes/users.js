import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();// sets new router

/* READ */
router.get("/:id", verifyToken, getUser); // load path with verify token and return user info
router.get("/:id/friends", verifyToken, getUserFriends);// load path with verify token and return user friends

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);// load path with verify and add or remove friend

export default router;
