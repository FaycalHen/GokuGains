import { createSlice } from "@reduxjs/toolkit";

import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [], // products will now have stock quantity
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      const existingProduct = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (existingProduct) {
        if (existingProduct.quantity + action.payload.quantity <= existingProduct.inStock) {
          existingProduct.quantity += action.payload.quantity;
          state.quantity += action.payload.quantity;
          state.total += action.payload.price * action.payload.quantity;

        } else {
          toast.error("Maximum stock reached for this product.", {
            position: "bottom-right",
            hideProgressBar: true,
            toastId: "cart-error", // Unique toast ID
          });}
      } else {
        if (action.payload.quantity <= action.payload.inStock) {
          state.products.push({ ...action.payload, quantity: action.payload.quantity });
          state.quantity += action.payload.quantity;
          state.total += action.payload.price * action.payload.quantity;
        } else {
          toast.error("Maximum stock reached for this product.", {
            position: "bottom-right",
            hideProgressBar: true,
            toastId: "cart-error", // Unique toast ID
          });
        }
      }
    },
    incrementQuantity: (state, action) => {
      const { _id } = action.payload;
      const existingProduct = state.products.find(
        (item) => item._id === _id
      );
      if (existingProduct) {
        
        //alert("heh"+existingProduct.quantity+"hehe"+existingProduct.price)
        if (existingProduct.quantity < existingProduct.inStock) {
          existingProduct.quantity += 1;
          state.quantity += 1;
          state.total += existingProduct.price;
        } else {
          toast.error("Maximum stock reached for this product.", {
            position: "top-left",
            hideProgressBar: true,
            toastId: "cart-error", // Unique toast ID
          });
        }
      }
    },
    decrementQuantity: (state, action) => {
      const existingProduct = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (existingProduct && existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
        state.quantity -= 1;
        state.total -= existingProduct.price;
      }
    },
    removeProduct: (state, action) => {
      const index = state.products.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        const removedProduct = state.products.splice(index, 1)[0];
        state.quantity -= removedProduct.quantity;
        state.total -= removedProduct.price * removedProduct.quantity;
      }
    },
    resetCart: (state) => {
      // Resetting to the initial state
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
  },
});

export const { addProduct, incrementQuantity, decrementQuantity, removeProduct,resetCart } = cartSlice.actions;
export default cartSlice.reducer;
