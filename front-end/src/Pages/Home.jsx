import React from "react";
import Announcement from "../Components/Announcement";
import Categories from "../Components/Categories";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Newsletter from "../Components/Newsletter";
import Products from "../Components/Products";
import Slider from "../Components/Slider";
import { useLocation } from 'react-router-dom';
import Whychooseus from "../Components/Whychooseus"
import Blog from "../Components/Blog"
import styled from "styled-components";
import Featured from "../Components/Featured";

const Container = styled.div`
  min-height: 100vh; /* Ensure it covers the full height */
`;
const Home = () => {
  const location = useLocation();
  const user = location.state?.user; // Access user information from location state

  const isAnnouncementVisible = true;
  return (
    <Container>
      {isAnnouncementVisible && <Announcement />} {/* Render Announcement based on the variable */}
      <Navbar showNavbar={isAnnouncementVisible} hasAnnouncement={isAnnouncementVisible}/>
      <Slider />
      <Categories/>
      {/*<Products />*/ }
      <Featured/>
      <Whychooseus/>
      <Blog/>
      <Newsletter />
      <Footer />
    </Container>
  );
};

export default Home;
