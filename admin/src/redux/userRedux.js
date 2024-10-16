import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
  },
  reducers: {
    addNotification: (state, action) => {
      state.list.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.list.splice(action.payload, 1);
    },
    clearNotifications: (state) => {
      state.list = [];
    },
  },
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: false,
    users: [], // Ensure users are initialized as an empty array
  },
  reducers: {
    getUsersStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getUsersSuccess: (state, action) => {
      state.isFetching = false;
      state.users = action.payload; // Ensure this is receiving correct data
    },
    
    getUsersFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    loginStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
    },
    addUserStart: (state) => {
      state.isFetching = true;
    },
    addUserSuccess: (state, action) => {
      state.isFetching = false;
      state.users.push(action.payload);
    },
    addUserFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    deleteUserStart: (state) => {
      state.isFetching = true;
    },
    deleteUserSuccess: (state, action) => {
      state.isFetching = false;
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
    deleteUserFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  addUserStart,
  addUserSuccess,
  addUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
} = userSlice.actions;

export const { addNotification, removeNotification, clearNotifications} = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
export const userReducer = userSlice.reducer;
