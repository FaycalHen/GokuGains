import { 
  addUserFailure,
  addUserStart, 
  addUserSuccess, 
  loginFailure, 
  loginStart, 
  loginSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
 } from "./userRedux";
import { publicRequest, userRequest } from "../requestMethods.js";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};

export const addUser = async (user, dispatch) => {
  dispatch(addUserStart());
  try {
    const res = await userRequest.post("/auth/register", user);
    dispatch(addUserSuccess(res.data));
    alert("User registered successfully!"); // Show success message
  } catch (err) {
    dispatch(addUserFailure());

    // Handle specific error responses
    if (err.response && err.response.status === 400) {
      alert(err.response.data.message || "Username already exists"); // Show error message
    } else {
      alert("An error occurred. Please try again."); // Generic error message
    }
  }
};
