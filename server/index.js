// App executable file
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url); // laod file url  .../server/index.js
const __dirname = path.dirname(__filename); // load dir path .../server
dotenv.config(); // load the .env file with all the variables
const app = express(); // load the app ROUTE
app.use(express.json()); //use the middleware of json that parses the incoming req to json object
app.use(helmet()); //  Sets http headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // set crossOriginResourcePolicy to cross-origin
app.use(morgan("common")); // setup a logger middleware, that use tokens for every request
app.use(bodyParser.json({ limit: "30mb"}));// parse request when heading type is 'json' with a limit of 30 megabytes
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));// parse request when heading type is 'urlencoding' with a limit of 30 megabytes with the extended option set to true, meaning that it will be encoding with the qs library
app.use(cors()); // middleware for requesting resources from outside resources
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); //enable the usage of files in /public/assets

/* FILE STORAGE */
const storage = multer.diskStorage({ // sets a instance for the configuration for uploading files, multer middleware creates a file or files fields in the req.body
  destination: function (req, file, cb) { // set a function to store files uploaded
    cb(null, "public/assets"); // callback for folder of files upload
  },
  filename: function (req, file, cb) { // set function for setting uploades files
    cb(null, file.originalname); // callback to set name file
  },
});
const upload = multer({ storage }); //set middleware multer intance with the configuration in storage

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register); //set a route to "/auth/register" with the middleware to upload a single file when register
app.post("/posts", verifyToken, upload.single("picture"), createPost); //set a route to "/posts" with token verification, to create posts with a file

/* ROUTES */
app.use("/auth", authRoutes);// set middleware to login every time a path match "/auth"
app.use("/users", userRoutes);// set middleware to login every time a path match "/users"
app.use("/posts", postRoutes);// set middleware to login every time a path match "/posts"

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;//set a port
const URL = process.env.MONGO_URL;//set a url connection to the db
mongoose
  // @ts-ignore
  .connect(URL, {//makes connection to the db given a url(atlas) with certain options
    useNewUrlParser: true,//parse the url to use the system atlas
    useUnifiedTopology: true,//makes posible to handle monitoring the server
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));//creates a http connection 

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));//handles error 
