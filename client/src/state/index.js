import { createSlice } from "@reduxjs/toolkit";

const initialState = {//set state base
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({// set reducer 
  name: "auth", //set a name for the reducer
  initialState,//set the base state data
  reducers: {
    setMode: (state) => {// change mode between dark and light
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {// set the user name and his token 
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {//erase user and token 
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {//set friends if user exist
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {//set posts
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {//updates a post
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;
