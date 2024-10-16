import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 40px;
  display: flex;
  justify-content: space-around;
  text-align: center;
`;

const CategoryItem = styled.div`
  cursor: pointer;
  padding: 10px;
  border-radius: 10px;
  transition: transform 0.3s ease;
  background-color: antiquewhite;
  &:hover {
    transform: scale(1.05);
  }
  
`;

const LinkItem=styled(Link)`
  text-decoration: none;
  color: inherit;
`

const categories = [
  { id: 1, name: "Weight Gainer", icon: "🏋️" },
  { id: 2, name: "Protein Powder", icon: "🚴" },
  { id: 3, name: "Multi Vitamins", icon: "⚽" },
  { id: 4, name: "Vitamins", icon: "🏃" },
  { id: 5, name: "Creatine", icon: "🏊" },
  { id: 6, name: "Carbohydrates", icon: "🏊" }
];
const Categories = () => {
  return (
    <Container>
      {categories.map((category) => (
        <CategoryItem key={category.id}>
          <LinkItem to={`Products/${category.name}`}>
            <h3>{category.icon} {category.name}</h3>
          </LinkItem>
        </CategoryItem>
      ))}
    </Container>
  );
};

export default Categories;
