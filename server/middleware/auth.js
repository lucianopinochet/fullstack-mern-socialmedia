import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {// create a function for verification
  try {
    let token = req.header("Authorization"); // set token if exist from the header

    if (!token) {
      return res.status(403).send("Access Denied"); //if token doesn't exist send error respond
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();// if token start with 'Bearer' slice it
    }

    // @ts-ignore
    const verified = jwt.verify(token, process.env.JWT_SECRET);// decode and verify token given a secret word, return user
    req.user = verified;// set user
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
