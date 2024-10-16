import Product from "./Pages/Product";
import Home from "./Pages/Home";
import ProductList from "./Pages/ProductList";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Cart from "./Pages/Cart";
import Profile from "./Pages/Profile";
import Success from "./Pages/Success";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Wishlist from "./Pages/Wishlist";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider

const App = () => {
  return (
    <GoogleOAuthProvider clientId="470418270631-3ruhmdj2efqgo6oosrrefsfba0e135li.apps.googleusercontent.com"> {/* Wrap with GoogleOAuthProvider */}
      <Router>
        <ToastContainer 
          position="top-left" // Position of the toast
          autoClose={2000} // Auto close after 2 seconds
          newestOnTop={true} 
          hideProgressBar // Hide the progress bar
          closeOnClick // Close on click
          pauseOnHover // Pause on hover
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:category" element={<ProductList />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/success" element={<Success />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:user" element={<Profile />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
