import { useEffect, useState } from "react";
import styled from "styled-components";
import Product from "./Product";
import axios from "axios";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const Container = styled.div`
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const SlideContainer = styled.div`
  display: flex;
  transition: transform 0.3s ease-in-out;
  transform: translateX(${props => props.translateValue}px);
  justify-content: space-between;
  padding: 10px;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(170, 170, 170, 0.7);
  border:none ;
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 1);

  }
  z-index: 10;
  cursor: pointer;
  opacity: 0.5;
  ${props => props.left ? "left: 10px;" : "right: 10px;"}
  display: ${props => props.disabled ? 'none' : 'block'};
`;

const ProductWrapper = styled.div`
  //width: 250px; /* Fixed width for each product */
  margin-right: 15px;
  margin-left: 15px;
  flex-shrink: 0;
`;

const Featured = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const productsPerSlide = 4; // Show 4 products per slide
  const slideWidth = 230 * productsPerSlide; // Width of each slide (4 products)

  useEffect(() => {
    const getFeaturedProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        const products = res.data;

        // Sort by rating and take top 8 products
        const topRatedProducts = products
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 8);

        setFeaturedProducts(topRatedProducts);
      } catch (err) {
        setError("Failed to load featured products.");
      } finally {
        setLoading(false);
      }
    };

    getFeaturedProducts();
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => Math.max(prevSlide - 1, 0));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      Math.min(prevSlide + 1, Math.ceil(featuredProducts.length / productsPerSlide) - 1)
    );
  };

  if (loading) return <div>Loading featured products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <Heading>Most Featured Products</Heading>

      <ArrowButton left onClick={handlePrevSlide} disabled={currentSlide === 0}>
        <NavigateBeforeIcon/>
      </ArrowButton>

      <SlideContainer translateValue={-currentSlide * slideWidth}>
        {featuredProducts.map((item) => (
          <ProductWrapper key={item.id}>
            <Product item={item} />
          </ProductWrapper>
        ))}
      </SlideContainer>

      <ArrowButton onClick={handleNextSlide} disabled={currentSlide === Math.ceil(featuredProducts.length / productsPerSlide) - 1}>
        <NavigateNextIcon/>
      </ArrowButton>
    </Container>
  );
};

export default Featured;
