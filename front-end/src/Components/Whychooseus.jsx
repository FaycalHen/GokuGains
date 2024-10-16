import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 50px;
  text-align: center;
  background-color: #f9f9f9;
  background-color: ${({ theme }) => theme.body}; // Use theme background
  color: ${({ theme }) => theme.text}; // Use theme text color
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
`;

const Points = styled.ul`
  list-style: none;
  padding: 0;
`;

const Point = styled.li`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Whychooseus = () => {
    return (
      <Container>
        <Title>Why Choose Us</Title>
        <Points>
          <Point>✔️ Largest authentic supplements</Point>
          <Point>✔️ High quality raw materials</Point>
          <Point>✔️ Top rated and reviewed products</Point>
          <Point>✔️ Trusted by experts</Point>
          <Point>✔️ Top bodybuilding supplement brands</Point>
        </Points>
      </Container>
    );
  };
  

export default Whychooseus;
