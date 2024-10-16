import styled from "styled-components";
import { mobile } from "../responsive";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/apiCalls"; // Adjust this import based on your actual path
import { addNotification } from "../redux/userRedux"; // Adjust this import based on your actual path

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://i.pinimg.com/736x/ff/61/1c/ff611c7bdceede7481301fbd86789f40.jpg") center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 40%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
`;

const LinkItem = styled(Link)`
  margin: 5px 0px;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
  color: inherit;
`;

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    name: "",
    lastName: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate =useNavigate();
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await addUser(inputs, dispatch);
      dispatch(addNotification({ message: "New user registered", type: "success" }));
      navigate("/")
    } catch (err) {
      console.error("Failed to register user:", err);
      dispatch(addNotification({ message: "Failed to register user", type: "error" }));
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form onSubmit={handleClick}>
          <Input name="name" placeholder="Name" onChange={handleChange} required />
          <Input name="lastName" placeholder="Last Name" onChange={handleChange} required />
          <Input name="username" placeholder="Username" onChange={handleChange} required />
          <Input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <Input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <Agreement>
            By creating an account, I consent to the processing of my personal data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <Button type="submit">CREATE</Button>
        </Form>
        <LinkItem to="/Login">ALREADY HAVE AN ACCOUNT</LinkItem>
      </Wrapper>
    </Container>
  );
};

export default Register;
