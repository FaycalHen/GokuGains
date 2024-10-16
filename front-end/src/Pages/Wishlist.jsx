import styled from "styled-components";
import Announcement from "../Components/Announcement";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { mobile } from "../responsive";
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import axios from "axios";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  padding-top: 10px;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
`;

const TopTexts = styled.div`
  ${mobile({ display: "none" })}
`;

const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  ${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span``;

const ProductId = styled.span``;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the buttons horizontally */
  justify-content: center; /* Center the buttons vertically within the container */
`;

const Icon = styled.button`
  width: 10%;
  height: 30px;
  padding: 10px;
  margin-top: 10px;
  background: none; /* Removes background */
  border: none; /* Removes border */
  cursor: pointer; /* Adds a pointer cursor on hover */
  color: #000000; /* Sets the icon color */
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;

  &:focus {
    outline: none; /* Removes the outline on focus */
  }

  &:hover {
    color: #bd3434; /* Changes color on hover */
  }
`;

const FeedbackMessage = styled.div`
  color: green;
  font-weight: bold;
  margin: 10px 0;
`;

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlistDetails = async () => {
      setLoading(true); // Start loading
      try {
        const res = await axios.get(`http://localhost:5000/api/wishlist/find/${user._id}`, {
          headers: { token: `Bearer ${user.accessToken}` },
        });
        const productDetailsPromises = res.data.products.map(product =>
          axios.get(`http://localhost:5000/api/products/find/${product.productId}`)
        );
        const productDetails = await Promise.all(productDetailsPromises);
        setWishlistItems(productDetails.map(res => res.data));
      } catch (err) {
        console.error("Failed to fetch wishlist details", err);
      } finally {
        setLoading(false); // End loading
      }
    };

    if (user) {
      fetchWishlistDetails();
    }
  }, [user]);

  const handleCheckItClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleRemove = async (productId) => {
    try {
      // Remove from wishlist
      await axios.delete(`http://localhost:5000/api/wishlist/${user._id}/product/${productId}`, {
        headers: { token: `Bearer ${user.accessToken}` },
      });
      setWishlistItems((prevItems) => prevItems.filter((item) => item._id !== productId));
      setFeedbackMessage("Product removed from wishlist!"); // Set feedback message
      setTimeout(() => {
        setFeedbackMessage(''); // Clear message after 3 seconds
      }, 3000);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Token expired. Please log in again.");
      } else {
        console.error("Failed to update wishlist", err);
        alert("Failed to update wishlist");
      }
    }
  };

  const isAnnouncementVisible =true;
  return (
    <Container>
      {isAnnouncementVisible && <Announcement />} {/* Render Announcement based on the variable */}
      <Navbar showNavbar={isAnnouncementVisible} hasAnnouncement={isAnnouncementVisible}/>
      <Wrapper>
        <Title>YOUR WISHLIST</Title>
        <Top>
          <Link to="/">
            <TopButton>CONTINUE SHOPPING</TopButton>
          </Link>
          <TopTexts>
            <TopText></TopText>
            <TopText>Your Wishlist ({wishlistItems.length})</TopText>
          </TopTexts>
        </Top>
        <Bottom>
          <Info>
            {loading ? ( // Show loading state
              <div>Loading your wishlist...</div>
            ) : (
              wishlistItems.length === 0 ? (
                <p>Your wishlist is empty.</p>
              ) : (
                wishlistItems.map((product) => (
                  <Product key={product._id}>
                    <ProductDetail>
                      <Image src={product.img} />
                      <Details>
                        <ProductId>
                          <b>ID:</b> {product._id}
                        </ProductId>
                        <ProductName>
                          <b>Product:</b> {product.title}
                        </ProductName>
                        <ProductSize>
                          <b>Description:</b> {product.desc}
                        </ProductSize>
                      </Details>
                    </ProductDetail>
                    <PriceDetail>
                      <ProductPrice>
                        $ {product.price}
                      </ProductPrice>
                    </PriceDetail>
                    <ButtonContainer>
                      <Icon onClick={() => handleCheckItClick(product._id)}>
                        <SearchIcon />
                      </Icon>
                      <Icon onClick={() => handleRemove(product._id)}>
                        <ClearIcon />
                      </Icon>
                    </ButtonContainer>
                  </Product>
                ))
              )
            )}
            <Hr />
            {feedbackMessage && <FeedbackMessage>{feedbackMessage}</FeedbackMessage>} {/* Feedback message */}
          </Info>
        </Bottom>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Wishlist;
