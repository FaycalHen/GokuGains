import React from 'react';
import styled from 'styled-components';

const StarContainer = styled.div`
  display: flex;
`;

const Star = styled.span`
  cursor: pointer;
  font-size: 30px;
  color: ${props => (props.filled ? 'gold' : 'lightgray')};

  &:hover {
    color: gold;
  }
`;

const Rating = ({ rating, onRatingChange }) => {
  return (
    <StarContainer>
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          filled={star <= rating}
          onClick={() => onRatingChange(star)}
        >
          ★
        </Star>
      ))}
    </StarContainer>
  );
};

export default Rating;
