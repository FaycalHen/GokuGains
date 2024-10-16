import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 30px;
  background-color: teal;
  color: wheat;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  position: fixed; /* Fix the position at the top */
  width: 100%; /* Full width */
  top: 0; /* Stick to the top */
  z-index: 100; /* Higher than the navbar */
`;

const Announcement = () => {
  return (
    <Container>
      Super deal yahahahaha %40 off !!!!
    </Container>
  );
};

export default Announcement;
