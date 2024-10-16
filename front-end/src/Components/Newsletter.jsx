import React, { useState } from 'react';
import axios from "axios";
import SendIcon from '@mui/icons-material/Send';
import styled from 'styled-components';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify'; // Import toast
import { jwtDecode } from 'jwt-decode';

const Container = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 70px;
  margin-bottom: 20px;
`;

const Desc = styled.div`
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  width: 50%;
  height: 40px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  border: 1px solid lightgray;
`;

const Input = styled.input`
  border: none;
  flex: 8;
  padding-left: 20px;
`;

const Button = styled.button`
  flex: 1;
  border: none;
  background-color: teal;
  color: white;
`;

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const responseGoogle = (credentialResponse) => {
    const userObject = jwtDecode(credentialResponse.credential);
    setEmail(userObject.email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return; // If there's no email, do nothing
    try {
      await axios.post(
        "http://localhost:5000/api/",
        {
          email: email,
        },
      );
      console.log("email",email);
      toast.success(`Subscribed with email: ${email}`); // Show success notification
    } catch (error) {
      toast.error('Failed to subscribe.'); // Show error notification
    }
  };

  return (
    <Container>
      <Title>Newsletter</Title>
      <Desc>Get timely updates from your favorite products.</Desc>
      <GoogleLogin
        onSuccess={responseGoogle}
        onFailure={(error) => console.error('Login Failed:', error)} // Handle errors
      />
      <form onSubmit={handleSubmit}>
        <InputContainer>
          <Input value={email} readOnly placeholder="Your email" />
          <Button type="submit">
            <SendIcon />
          </Button>
        </InputContainer>
      </form>
    </Container>
  );
};

export default Newsletter;
