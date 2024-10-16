import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #6c63ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5753d0;
  }
`;

const Confirmation = ({ onConfirm, onCancel, orderDetails }) => {
  return (
    <>
      <ModalOverlay onClick={onCancel} />
      <ModalContainer>
        <h2>Confirm Order</h2>
        <p>Please confirm your order:</p>
        <ul>
          {orderDetails.products.map((item) => (
            <li key={item._id}>
              {item.title} - Quantity: {item._quantity}
            </li>
          ))}
        </ul>
        <p>Total: ${orderDetails.total}</p>
        <Button onClick={onConfirm}>Confirm</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </ModalContainer>
    </>
  );
};

export default Confirmation;
