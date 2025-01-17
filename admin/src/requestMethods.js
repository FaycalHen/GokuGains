import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";

// Retrieve the token from localStorage
const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
console.log("user", user);
const currentUser = user && JSON.parse(user).currentUser;
const TOKEN = currentUser?.accessToken;
console.log("token ",TOKEN);
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

// Correct the key from 'header' to 'headers'
export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },});
