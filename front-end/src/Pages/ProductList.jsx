import styled from "styled-components";
import Navbar from "../Components/Navbar";
import Announcement from "../Components/Announcement";
import Products from "../Components/Products";
import Newsletter from "../Components/Newsletter";
import Footer from "../Components/Footer";
import { mobile } from "../responsive";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const Container = styled.div``;

const Title = styled.h1`
  margin: 20px;
  padding-top: 25px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  
`;

const Filter = styled.div`
  margin: 20px;
  ${mobile({ width: "0px 20px", display: "flex", flexDirection: "column" })}
`;

const FilterText = styled.span`
  font-size: 20px;
  font-weight: 600;
  margin-right: 20px;
  ${mobile({ marginRight: "0px" })}
`;

const Select = styled.select`
  padding: 10px;
  margin-right: 20px;
  ${mobile({ margin: "10px 0px" })}
`;
const NewsletterWrapper = styled.div`
  margin-top: auto; // Push the newsletter and footer to the bottom
`;
const Option = styled.option``;

const ProductList = () => {
  const location = useLocation();
  const cat = decodeURI(location.pathname.split("/")[2]);
  console.log(cat);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const productsPerPage = 12; // Set the number of products per page
  const handleFilters = (e) => {
    const value = e.target.value;
    setFilter({
      ...filter,
      [e.target.name]: value
    });
  };

  console.log(filter);
  const isAnnouncementVisible =true;
  return (
    <Container>
      {isAnnouncementVisible && <Announcement />} {/* Render Announcement based on the variable */}
      <Navbar cat={cat} showNavbar={isAnnouncementVisible} hasAnnouncement={isAnnouncementVisible}/>
      <Title>{cat.charAt(0).toUpperCase() + cat.slice(1)} Products</Title>
      <FilterContainer>
        <Filter>
          <FilterText>Filter by Rating:</FilterText>
          <Select name="rating" onChange={handleFilters}>
            <Option disabled>Select Rating</Option>
            <Option value="all">All product</Option>
            <Option value="0">0 star</Option>
            <Option value="1">1 Star</Option>
            <Option value="2">2 Stars</Option>
            <Option value="3">3 Stars</Option>
            <Option value="4">4 Stars</Option>
            <Option value="5">5 Stars</Option>
          </Select>
        </Filter>
        <Filter>
          <FilterText>Sort Products:</FilterText>
          <Select onChange={(e) => setSort(e.target.value)}>
            <Option value={"newest"}>Newest</Option>
            <Option value={"asc"}>Price (asc)</Option>
            <Option value={"desc"}>Price (desc)</Option>
          </Select>
        </Filter>
      </FilterContainer>
      <Products
        cat={cat}
        filters={filter}
        sort={sort}
        productsPerPage={productsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <NewsletterWrapper>
        <Newsletter />
        <Footer />
      </NewsletterWrapper>
    </Container>
  );
};

export default ProductList;
