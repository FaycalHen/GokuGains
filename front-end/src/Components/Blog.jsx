import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 50px;
  background-color: #fff;
  background-color: ${({ theme }) => theme.body}; // Use theme background
  color: ${({ theme }) => theme.text}; // Use theme text color
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const BlogGrid = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BlogPost = styled.div`
  width: 30%;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 10px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const BlogSection = () => {
  const posts = [
    { title: "Expand scope of one million mask donation", date: "2 hours ago" },
    { title: "Staying safe at the gym during COVID-19", date: "5 hours ago" },
    { title: "Strength and performance for golfers", date: "8 hours ago" }
  ];

  return (
    <Container>
      <Title>From Our Blog</Title>
      <BlogGrid>
        {posts.map((post, index) => (
          <BlogPost key={index}>
            <h3>{post.title}</h3>
            <p>{post.date}</p>
          </BlogPost>
        ))}
      </BlogGrid>
    </Container>
  );
};

export default BlogSection;