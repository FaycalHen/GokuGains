import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Badge from '@mui/material/Badge';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useNavigate } from 'react-router-dom';
import { mobile } from "../responsive";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { publicRequest } from "../requestMethods.js";
import { logout, setTokenExpired } from '../redux/userRedux.js';
import {jwtDecode} from 'jwt-decode'; // Removed curly braces
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ClickAwayListener } from '@mui/material'; // To close the menu when clicked outside
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Container = styled.div`
  height: 60px;
  position: relative;
  transition: top 0.3s;
  top: ${({ showNavbar, hasAnnouncement }) => (hasAnnouncement ? (showNavbar ? '30px' : '-100px') : (showNavbar ? '0px' : '-100px'))};
  z-index: 1;
  ${mobile({ height: "50px" })}
  display: flex;
  align-items: center; // Added this line to center everything vertically
`;

const Wrapper = styled.div`
  padding: 0 20px; // Removed vertical padding to help center things
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%; // Ensure it takes full height of Container
`;


const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Language = styled.span`
  font-size: 16px;
  cursor: pointer;
  color: #333;
  font-weight: 500;
  margin-right: 20px;
  transition: color 0.2s;
  &:hover {
    color: #000;
  }
`;

const SearchContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 20px;
  display: flex;
  align-items: center;
  margin-left: 25px;
  padding: 6px 12px;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  background: transparent;
  margin-right: 10px;
  font-size: 16px;
  color: #333;
  width: 150px;
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Logo = styled.h1`
  font-weight: bold;
  font-size: 24px;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const Right = styled.div`
  /*flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;*/
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px; // Ensure equal spacing between all icons
`;

const MenuItem = styled.div`
  font-size: 16px;
  color: #000000;
  cursor: pointer;
  //margin-left: 10px;
  //padding-right: 15px;
  transition: color 0.2s ease, transform 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  &:hover {
    color: #7a7a7a;
    transform: translateY(-2px);
  }
`;

const LinkItem = styled(Link)`
  text-decoration: none;
  color: inherit;
`;
const Image = styled.img`
  width: 40px; 
  height: 40px; 
  //padding-left: 15px; // Optional, remove if it affects alignment
  border-radius: 50%;  
  object-fit: cover;   
  border: 2px solid #ddd; // Optional, for better visualization
  cursor: pointer;
  display: inline-block;
`;

const ImageContainer = styled.div`
padding-bottom: 15px;
`;
const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 100;
  min-width: 150px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  color: #333;
  transition: background-color 0.3s;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Navbar = ({ cat, hasAnnouncement }) => {
  const quantity = useSelector((state) => state.cart.quantity);
  const user = useSelector((state) => state.user.currentUser);
  console.log("user",user)
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown menu state
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  //const [hasAnnouncement, sethasA] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    if (user && user.accessToken) {
      const decodedToken = jwtDecode(user.accessToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        dispatch(setTokenExpired());
        dispatch(logout());
        navigate("/login");
      }
    }
  }, [user, dispatch, navigate]);

  const handleSearch = async () => {
    try {
      const res = await publicRequest.get(`/products/find?title=${searchQuery}`);
      const product = res.data;

      if (product && product._id) {
        navigate(`/product/${product._id}`);
      } else {
        alert("Product not found!");
      }
    } catch (error) {
      console.error("Product search failed", error);
      alert("Product not found!");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("persist:root");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickAway = () => {
    setIsDropdownOpen(false); // Close dropdown when clicking outside
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Container showNavbar={showNavbar} hasAnnouncement={hasAnnouncement}>
        <Wrapper>
          <Left>
            <Language>EN</Language>
            <SearchContainer>
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <FitnessCenterIcon
                style={{ color: "#555", fontSize: 18, cursor: "pointer" }}
                onClick={handleSearch}
              />
            </SearchContainer>
          </Left>
          <Center>
            <LinkItem to="/">
              <Logo>GOKUGAINS.</Logo>
            </LinkItem>
          </Center>
          <Right>
            <LinkItem to="/wishlist">
              <FavoriteBorderIcon />
            </LinkItem>
            <LinkItem to={`/cart?cat=${cat}`}>
              <MenuItem>
                <Badge badgeContent={quantity} color="primary">
                  <ShoppingCartCheckoutIcon />
                </Badge>
              </MenuItem>
            </LinkItem>
            
            {user ? (
            <>
              <Image
                src={user?.avatar || "https://i.pinimg.com/564x/bb/c2/5a/bbc25aa33170955b480c2095d227bc1f.jpg"}
                alt="Avatar"
                onClick={toggleDropdown}
              />
              <DropdownMenu isOpen={isDropdownOpen}>
                <DropdownItem onClick={() => navigate(`/${user._id}`)}>Edit Profile</DropdownItem>
                <DropdownItem onClick={() => navigate("/feedback")}>Send Feedback</DropdownItem>
                <DropdownItem onClick={() => navigate("/add-blog")}>Add a Blog</DropdownItem>
                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
              </DropdownMenu>
            </>
            ) : (
            <LinkItem to="/login"> 
              <MenuItem>
                <AccountCircleIcon style={{ fontSize: 28 }} />
              </MenuItem>
            </LinkItem>
            )}
          </Right>
        </Wrapper>
      </Container>
    </ClickAwayListener>
  );
};

export default Navbar;
