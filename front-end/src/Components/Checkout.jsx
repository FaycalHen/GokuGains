import React, { useState } from 'react'; 
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch, useSelector } from 'react-redux';
import { resetCart } from '../redux/cartRedux';

const CheckoutContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  z-index: 100;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the contents */
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  width: 99%;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;

  &:hover {
    color: red;
  }
`;

const Checkout = ({ cart, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });
  const dispatch=useDispatch()
  console.log("cart",cart)
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Show confirmation modal
    const confirmed = window.confirm("Do you want to confirm your order?"); // Use a simple confirm dialog
    if (confirmed) {
      dispatch(resetCart())
      // Navigate to success page with form data and cart information
      navigate('/success', { state: { cart, formData, userId: currentUser._id } });
      onClose(); // Close the checkout modal
    }
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <CheckoutContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>Checkout</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Button type="submit">Submit</Button>
        </form>
      </CheckoutContainer>
    </>
  );
};

export default Checkout;
