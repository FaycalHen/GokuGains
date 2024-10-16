import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 200px; // Adjust as needed
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
`;

const Title = styled.h4`
  font-size: 1.2rem;
`;

const Price = styled.span`
  font-weight: bold;
  color: teal;
`;

const SuggestedProduct = ({ product }) => {
  return (
    <Container>
      <Image src={product.img} alt={product.title} />
      <Title>{product.title}</Title>
      <Price>${product.price}</Price>
    </Container>
  );
};

export default SuggestedProduct;
