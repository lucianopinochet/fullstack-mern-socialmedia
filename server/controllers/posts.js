// @ts-nocheck
import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {// function for creating post
  try {
    const { userId, description, picturePath } = req.body; //set values from request
    const user = await User.findById(userId);// find user from db
    const newPost = new Post({// create new post
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save(); //save new post to db

    const post = await Post.find();// find every post
    res.status(201).json(post);// send every post 
  } catch (err) {
    res.status(409).json({ message: err.message });//send response error 
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {//function that returns posts
  try {
    const post = await Post.find();//find every post from db
    res.status(200).json(post);//send response if succesfull
  } catch (err) {
    res.status(404).json({ message: err.message });//send error response
  }
};

export const getUserPosts = async (req, res) => {//function that returns user posts
  try {
    const { userId } = req.params;//gets user id from path params
    const post = await Post.find({ userId });//gets posts from id 
    res.status(200).json(post);//send response if succesfull
  } catch (err) {
    res.status(404).json({ message: err.message });//send error response
  }
};

/* UPDATE */
export const likePost = async (req, res) => { //function add or remove like
  try {
    const { id } = req.params;//gets post id from path params
    const { userId } = req.body;//gets userid from request
    const post = await Post.findById(id);//find post from id
    const isLiked = post.likes.get(userId);// check if the user id is in the likes map

    if (isLiked) {
      post.likes.delete(userId);//if posts had the like, get delete it 
    } else {
      post.likes.set(userId, true);// if the posts didn't had the like, it's set to true
    }

    const updatedPost = await Post.findByIdAndUpdate(//find post by id and updates and add values and return a formated version
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);//send response if succesfull
  } catch (err) {
    res.status(404).json({ message: err.message });//send error response
  }
};
