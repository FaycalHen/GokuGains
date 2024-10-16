import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom"; 
import axios from "axios";
import styled from "styled-components";
import { useEffect, useState } from 'react';
import { addProduct } from "../redux/cartRedux";
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;
`;

const Container = styled.div`
  flex: 1;
  margin: 5px;
  min-width: 280px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5fbfd;
  position: relative;

  &:hover ${Info} {
    opacity: 1;
  }
`;

const Circle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
`;

const Image = styled.img`
  height: 75%;
  z-index: 2;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px; /* Space between icons and title/price */
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.5s ease;
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;

const Title = styled.div`
  width: 60px;
  height: 20px;
  border-radius: 0%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.5s ease;
  white-space: nowrap;  /* Prevent text from wrapping to the next line */
  overflow: hidden;     /* Hide any text that overflows */
  text-overflow: ellipsis;  /* Add ellipsis (...) if text overflows */
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;

const Price = styled.div`
  width: 60px;
  height: 20px;
  border-radius: 0%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.5s ease;
  white-space: nowrap;  /* Prevent text from wrapping to the next line */
  overflow: hidden;     /* Hide any text that overflows */
  text-overflow: ellipsis;  /* Add ellipsis (...) if text overflows */
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;

const TitlePriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LinkItem = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Product = ({ item }) => {
  const user = useSelector((state) => state.user.currentUser);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!user || !item) {
      return; // Skip if no user or item is available
    }

    const checkWishlist = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/wishlist/find/${user._id}`, {
          headers: { token:` Bearer ${user.accessToken} `},
        });
        const wishlist = res.data;
        const productInWishlist = wishlist.products.some(
          (product) => product.productId === item._id
        );
        setIsInWishlist(productInWishlist);
      } catch (err) {
        console.error("Failed to check wishlist", err);
      }
    };

    checkWishlist();
  }, [user, item]);

  // Ensure item is available before rendering
  if (!item) {
    return <div>Loading product...</div>; // Or handle it gracefully with a loading state
  }

  const handleAddToCart = () => {
    if (!item) return; // Ensure item is available before proceeding
      dispatch(addProduct({
        _id: item._id,
        title: item.title,
        img: item.img,
        price: item.price,
        desc: item.desc,
        inStock: item.inStock,
        quantity: 1,
      }));
      
      toast.success(`${item.title} has been added to your cart!`, {
        position: "top-left",
        hideProgressBar: true,
        toastId: "cart-add", // Unique toast ID
      });
  };
  

  const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleToggleWishlist = debounce(async () => {
    if (!user) {
      toast.error("You need to log in to manage your wishlist.", {
        position: "top-left",
        hideProgressBar: true,
        toastId: "login-error", // Unique toast ID
      });
      return;
    }
  
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`http://localhost:5000/api/wishlist/${user._id}/product/${item._id}`, {
          headers: { token: `Bearer ${user.accessToken} `},
        });
        toast.success("Product removed from wishlist!", {
          position: "top-left",
          hideProgressBar: true,
          toastId: "wishlist-remove", // Unique toast ID
        });
        // Ensure the toast is dismissed after 3 seconds
        setTimeout(() => {
          toast.dismiss("wishlist-remove");
        }, 2000);
      } else {
        // Add to wishlist
        await axios.post(
          "http://localhost:5000/api/wishlist",
          {
            userId: user._id,
            products: [{ productId: item._id }],
          },
          {
            headers: { token: `Bearer ${user.accessToken}` },
          }
        );
        toast.success("Product added to wishlist!", {
          position: "top-left",
          hideProgressBar: true,
          toastId: "wishlist-add", // Unique toast ID
        });
        // Ensure the toast is dismissed after 3 seconds
        setTimeout(() => {
          toast.dismiss("wishlist-add");
        }, 2000);
      }
  
      // Update the wishlist state
      setIsInWishlist(!isInWishlist);
  
    } catch (err) {
      console.error("Failed to update wishlist", err);
      toast.error("Failed to update wishlist. Please try again.", {
        position: "top-left",
        toastId: "wishlist-error", // Unique toast ID
      });
    }
  }, 100);  // Debounce delay to prevent rapid clicks
  
  
  return (
    <Container>
      <Circle />
      <Image src={item.img} />
      <Info>
        <IconContainer>
          <Icon>
            <ShoppingCartIcon onClick={handleAddToCart} />
          </Icon>
          <Icon>
            <LinkItem to={`/product/${item._id}`}>
              <SearchIcon />
            </LinkItem>
          </Icon>
          <Icon onClick={handleToggleWishlist}>
            {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </Icon>
        </IconContainer>
        <TitlePriceContainer>
          <Title>{item.title}</Title>
          <Price>{item.price}</Price>
        </TitlePriceContainer>
      </Info>
    </Container>
  );
};

export default Product;
