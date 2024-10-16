import {
  loginFailure,
  loginStart,
  loginSuccess,
  addUserStart,
  addUserSuccess,
  addUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "./userRedux";
import { publicRequest, userRequest } from "../requestMethods";
import {
  getProductFailure,
  getProductStart,
  getProductSuccess,
  deleteProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  updateProductFailure,
  updateProductStart,
  updateProductSuccess,
  addProductFailure,
  addProductStart,
  addProductSuccess,
} from "./productRedux";
import { getUsersStart, getUsersSuccess, getUsersFailure } from "./userRedux";


export const getUsers = async (dispatch) => {
  dispatch(getUsersStart());
  try {
    const res = await userRequest.get("/users");
    dispatch(getUsersSuccess(res.data));
  } catch (err) {
    dispatch(getUsersFailure());
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

export const deleteUser = async (id, dispatch) => {
  try {
    await userRequest.delete(`/users/${id}`);
    dispatch(deleteUserSuccess(id));
  } catch (err) {
    dispatch(deleteUserFailure());
    console.error(err);
  }
};

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await userRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};

export const getProducts = async (dispatch) => {
  dispatch(getProductStart());
  try {
    const res = await publicRequest.get("/products");
    dispatch(getProductSuccess(res.data));
  } catch (err) {
    dispatch(getProductFailure());
  }
};

export const deleteProduct = async (id, dispatch) => {
  dispatch(deleteProductStart());
  try {
    await userRequest.delete(`/products/${id}`); // Fixed the endpoint format
    dispatch(deleteProductSuccess(id));
  } catch (err) {
    dispatch(deleteProductFailure());
  }
};

export const updateProduct = async (id, product, dispatch) => {
  dispatch(updateProductStart());
  try {
    await userRequest.put(`/products/${id}`, product); // Added the API call for updating product
    dispatch(updateProductSuccess({ id, product }));
  } catch (err) {
    dispatch(updateProductFailure());
  }
};

export const addProduct = async (product, dispatch) => {
  dispatch(addProductStart());
  try {
    const res = await userRequest.post("/products", product); // Fixed the endpoint format
    dispatch(addProductSuccess(res.data));
  } catch (err) {
    dispatch(addProductFailure());
  }
};
