// @ts-nocheck
import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {// function that return user info
  try {
    const { id } = req.params;//gets id from path params
    const user = await User.findById(id); // find user by id
    res.status(200).json(user); // respond if succesful
  } catch (err) {
    res.status(404).json({ message: err.message }); // respond error
  }
};

export const getUserFriends = async (req, res) => { //funtion that return user friends
  try {
    const { id } = req.params;//gets id from path params
    const user = await User.findById(id);// find user by id

    const friends = await Promise.all(// get every user by id from the list of friends
      // @ts-ignore
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(// format every user(friends) to send certain info
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends); // respond if succesful
  } catch (err) {
    res.status(404).json({ message: err.message });// respond error
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {// function that add or remove friends from user db
  try {
    const { id, friendId } = req.params;//gets id and friendid from path params
    const user = await User.findById(id);// find user by id
    const friend = await User.findById(friendId);// find user friend by id

    if (user.friends.includes(friendId)) {// get executed if the friend id is in the list of friends
      user.friends = user.friends.filter((thisid) => thisid !== friendId); //get friends by every id that isn't the friends id
      friend.friends = friend.friends.filter((thisid) => thisid !== id);// get friends by every id that isn't the users id
    } else { // get executed if id wasn't in list
      user.friends.push(friendId);// push id in users list
      friend.friends.push(id);//push id in friends list
    }
    await user.save();//save user with new friend list
    await friend.save();//save friend with new friend list

    const friends = await Promise.all( // get every user by id from the list of friends
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(// format every user(friends) to send certain info
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);// respond if succesful
  } catch (err) {
    res.status(404).json({ message: err.message });// respond error
  }
};
