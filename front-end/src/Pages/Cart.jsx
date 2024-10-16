import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import styled from "styled-components";
import Announcement from "../Components/Announcement";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { mobile } from "../responsive";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods.js";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { incrementQuantity, decrementQuantity,removeProduct, resetCart, } from "../redux/cartRedux";
import Checkout from '../Components/Checkout.jsx';


const Container = styled.div`
//margin-top: 30px;
`;

const Wrapper = styled.div`
  padding: 30px;
  padding-top: 40px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
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

const LinkItem = styled(Link)
`
  text-decoration: none;
  color: inherit;
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
  padding-top: 10px;
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

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: "5px 15px" })}
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

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;

const Icon = styled.button`
  width: 10%;
  height: 30px;
  padding: 10px;
  margin-top: 10px;
  background: none;  /* Removes background */
  border: none;  /* Removes border */
  cursor: pointer;  /* Adds a pointer cursor on hover */
  color: #000000;  /* Sets the icon color */
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;

  &:focus {
    outline: none;  /* Removes the outline on focus */
  }

  &:hover {
    color: #bd3434;  /* Changes color on hover */
  }
`;

const IconSearch = styled.button`
  width: 0%;
  height: 30px;
  padding: 0px;
  margin-top: 10px;
  background: none;  /* Removes background */
  border: none;  /* Removes border */
  cursor: pointer;  /* Adds a pointer cursor on hover */
  color: #000000;  /* Sets the icon color */
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;

  &:focus {
    outline: none;  /* Removes the outline on focus */
  }

  &:hover {
    color: #bd3434;  /* Changes color on hover */
  }
`;


const Cart = () => {
  
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.currentUser);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const quantity = cart.products.reduce((acc, item) => acc + item.quantity, 0);
  const queryParams = new URLSearchParams(location.search);
  const cat = queryParams.get("cat") || null;
  
  console.log( "cat  "+cat);
  let und = true;
  if (cat === 'undefined') {
     und = true;
  }else{
     und = false;
  }
  console.log(und)
  
  const handleCheckoutSubmit = (formData) => {
    console.log("User info:", formData);
    // Send this data to the admin (e.g., via an API request)
    setShowCheckout(false);  // Hide the checkout form after submission
  };

  const handleIncrement = (product) => {
    dispatch(incrementQuantity({
      _id: product._id,
      title: product.title,
      img: product.img,
      price: product.price,
      desc: product.desc,
      qnt: product.quantity,
    }));
  };
  
  const handleDecrement = (product) => {
    dispatch(decrementQuantity({
      _id: product._id,
      title: product.title,
      img: product.img,
      price: product.price,
      desc: product.desc,
      qnt: product.quantity,
    }));
  };

  const handleRemove = (product) => {
    dispatch(removeProduct(product));
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await userRequest.get(`http://localhost:5000/api/wishlist/find/${user._id}`, {
          headers: { token: `Bearer ${user.accessToken}` },
        });
        setWishlistItems(res.data.products || []);
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      }
    };

    if (user) {
      fetchWishlist();
    }
  }, [user]);

  
  const handleOpenCheckout = () => setCheckoutOpen(true);
  const handleCloseCheckout = () => setCheckoutOpen(false);
  


  const handleCheckItClick = (productId) => {
    navigate(`/product/${productId}`);
  };  

  const isAnnouncementVisible = true;

  return (
    <Container>
      {isAnnouncementVisible && <Announcement />} {/* Render Announcement based on the variable */}
      <Navbar showNavbar={isAnnouncementVisible} hasAnnouncement={isAnnouncementVisible}/>
      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <Link to={und ?  "/" : `/products/${cat}`}>
            <TopButton>CONTINUE SHOPPING</TopButton>
          </Link>
          <TopTexts>
            <TopText>Shopping Bag({quantity})</TopText>
            <TopText>
              <LinkItem to="/wishlist">
                Your Wishlist ({wishlistItems.length})
              </LinkItem>  
            </TopText>
          </TopTexts>
        <TopButton type="filled" onClick={handleOpenCheckout}>CHECKOUT NOW</TopButton>
        </Top>
        <Bottom>
          <Info>
            {cart.products.map((product) => (
              <Product>
                <ProductDetail>
                  <Image src={product.img} />
                  <Details>
                    <ProductName>
                      <b>Product:</b> {product.title}
                    </ProductName>
                    <ProductId>
                      <b>ID:</b> {product._id}
                    </ProductId>
                    <ProductColor color={product.color} />
                    <ProductSize>
                      <b>Size:</b> {product.size}
                    </ProductSize>
                  </Details>
                </ProductDetail>
                <PriceDetail>
                  <ProductAmountContainer>
                    <Add onClick={() => handleIncrement(product)} />
                      <ProductAmount>{product.quantity}</ProductAmount>
                    <Remove onClick={() => handleDecrement(product)} />
                    
                  </ProductAmountContainer>
                  <ProductPrice>
                    $ {product.price * product.quantity}
                  </ProductPrice>
                  
                </PriceDetail>
                <IconSearch onClick={() => handleCheckItClick(product._id)}>
                        <SearchIcon/>
                </IconSearch>
                <Icon onClick={() => handleRemove(product)}>
                      <ClearIcon/>
                </Icon>
              </Product>
              
            ))}
            <Hr />
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Estimated Shipping</SummaryItemText>
              <SummaryItemPrice>$ 5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Shipping Discount</SummaryItemText>
              <SummaryItemPrice>$ -5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            <Button onClick={handleOpenCheckout}>CHECK OUT</Button>
          </Summary>
        </Bottom>
          {isCheckoutOpen && (
          <Checkout
          onSubmit={(formData) => {
            console.log('Form submitted', formData);
            handleCloseCheckout(); // Close the checkout on submit if needed
          }}
          onClose={handleCloseCheckout} // Ensure this is a function
          cart={cart}
        />
          )}
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Cart;