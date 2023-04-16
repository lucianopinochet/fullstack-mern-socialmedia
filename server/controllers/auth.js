import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => { // function middleware for creating a new user
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body; //set values from the body of the request

    const salt = await bcrypt.genSalt(); // generate a salt for hashing password
    const passwordHash = await bcrypt.hash(password, salt); // generate hash of the password  with the salt

    const newUser = new User({ // create a template of a User
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),//generate random number
      impressions: Math.floor(Math.random() * 10000),//generate random number
    });
    // @ts-ignore
    const savedUser = await newUser.save();//save the new user into the db
    res.status(201).json(savedUser); // send the response with status 201 and the user info
  } catch (err) {
    res.status(500).json({ error: err.message }); // send response if error 
  }
};

/* LOGGING IN */
export const login = async (req, res) => {// fucntion middleware that login
  try {
    const { email, password } = req.body; //sets variables from request
    const user = await User.findOne({ email: email });// find user with certain email
    if (!user) return res.status(400).json({ msg: "User does not exist. " });// send error response if user doesn't exist

    // @ts-ignore
    const isMatch = await bcrypt.compare(password, user.password); //compare the encrypted password from the db with the given
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });// if password doesn't match sends error

    // @ts-ignore
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);// generate token given secret key
    // @ts-ignore
    delete user.password;// delete password
    res.status(200).json({ token, user }); // respond token and user
  } catch (err) {
    res.status(500).json({ error: err.message });//respond with error
  }
};
