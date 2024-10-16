/**  import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import styled from "styled-components";
import Announcement from "../Components/Announcement";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Newsletter from "../Components/Newsletter";
import { mobile } from "../responsive";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods";
import { addProduct } from "../redux/cartRedux";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CircularProgress from '@mui/material/CircularProgress'; // Import loading spinner
import Alert from '@mui/material/Alert'; // Import alert for error handling
import Rating from '../Components/Rating';

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  ${mobile({ padding: "10px", flexDirection: "column" })}
`;

const ImgContainer = styled.div`
  flex: 1;
`;

const Image = styled.img`
  width: 100%;
  height: 90vh;
  object-fit: cover;
  ${mobile({ height: "40vh" })}
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 0px 50px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 200;
`;

const Desc = styled.p`
  margin: 20px 0px;
`;

const Price = styled.span`
  font-weight: 100;
  font-size: 40px;
`;

const FilterContainer = styled.div`
  width: 50%;
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  ${mobile({ width: "100%" })}
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
`;

const FilterTitle = styled.span`
  font-size: 20px;
  font-weight: 200;
`;

const FilterColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  margin: 0px 5px;
  cursor: pointer;
`;

const FilterSize = styled.select`
  margin-left: 10px;
  padding: 5px;
`;

const FilterSizeOption = styled.option``;

const AddContainer = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ width: "100%" })}
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const Amount = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
`;

const Button = styled.button`
  padding: 15px;
  border: 2px solid teal;
  background-color: white;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #f8f4f4;
  }
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

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh; // Adjust according to your layout
`;

const Product = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const user = useSelector((state) => state.user.currentUser);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to hold error messages

  const [userRating, setUserRating] = useState(0); // State to hold user's rating

  const handleRatingChange = async (newRating) => {
    setUserRating(newRating);
    try {
        const res = await axios.put(`http://localhost:5000/api/products/${id}/rate`, {
            rating: newRating,
            userId: user._id // Send user ID along with the rating
        });
        setProduct(res.data); // Update product state with the new average and count
    } catch (error) {
        console.error('Failed to submit rating', error);
    }
};

  useEffect(() => {
    if (user) {
      const checkWishlist = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/wishlist/find/${user._id}`, {
            headers: { token: `Bearer ${user.accessToken}` },
          });
          const wishlist = res.data;
          const productInWishlist = wishlist.products.some(
            (product) => product.productId === id
          );
          setIsInWishlist(productInWishlist);
        } catch (err) {
          console.error("Failed to check wishlist", err);
        }
      };

      checkWishlist();
    }
  }, [user, id]);

  useEffect(() => {
    const getProduct = async () => {
        setLoading(true);
        try {
            const res = await publicRequest.get("/products/find/" + id);
            setProduct(res.data);
            
            // Check if user has already rated this product
            const userRatingObj = res.data.ratings.find(r => r.userId === user._id);
            if (userRatingObj) {
                setUserRating(userRatingObj.rating); // Set the user's rating
            }
        } catch (error) {
            setError("Failed to load product. Please try again later.");
            console.error("Error fetching product:", error);
        } finally {
            setLoading(false);
        }
    };
    getProduct();
}, [id, user._id]);


  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress /> {// Loading spinner }
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <LoadingContainer>
        <Alert severity="error">{error}</Alert> {// Display error message }
      </LoadingContainer>
    );
  }

  const handleToggleWishlist = async () => {
    if (!user) {
      alert("Please log in to manage your wishlist.");
      return;
    }

    try {
      if (isInWishlist) {
        await axios.delete(`http://localhost:5000/api/wishlist/${user._id}/product/${id}`, {
          headers: { token: `Bearer ${user.accessToken}` },
        });
        alert("Product removed from wishlist!");
      } else {
        await axios.post(
          "http://localhost:5000/api/wishlist",
          {
            userId: user._id,
            products: [{ productId: id }],
          },
          {
            headers: { token: `Bearer ${user.accessToken}` },
          }
        );
        alert("Product added to wishlist!");
      }
      setIsInWishlist(!isInWishlist);
    } catch (err) {
      console.error("Failed to update wishlist", err);
      alert("Failed to update wishlist");
    }
  };

  const handleQuantity = (type) => {
    if (type === "dec") {
      quantity > 1 && setQuantity(quantity - 1);
    } else {
      quantity < product.inStock && setQuantity(quantity + 1);
    }
  };

  const handleClick = () => {
    dispatch(addProduct({ ...product, quantity, color, size }));
  };

  return (
    <Container>
      <Navbar />
      <Announcement />
      <Wrapper>
        <ImgContainer>
          <Image src={product.img} />
        </ImgContainer>
        <InfoContainer>
          <Title>{product.title}</Title>
          <Desc>{product.desc}</Desc>
          <Price>$ {product.price}</Price>
          <Rating rating={userRating} onRatingChange={handleRatingChange} />
          <span>{product.averageRating.toFixed(1)} ({product.ratingCount})</span>
          <FilterContainer>
            <Filter>
              <FilterTitle>Color</FilterTitle>
              {product.color?.map((c) => (
                <FilterColor color={c} key={c} onClick={() => setColor(c)} />
              ))}
            </Filter>
            <Filter>
              <FilterTitle>Size</FilterTitle>
              <FilterSize onChange={(e) => setSize(e.target.value)}>
                {product.size?.map((s) => (
                  <FilterSizeOption key={s}>{s}</FilterSizeOption>
                ))}
              </FilterSize>
            </Filter>
          </FilterContainer>
          <AddContainer>
            <AmountContainer>
              <Remove onClick={() => handleQuantity("dec")} />
              <Amount>{quantity}</Amount>
              <Add onClick={() => handleQuantity("inc")} />
            </AmountContainer>
            <Button onClick={handleClick}>ADD TO CART</Button>
          </AddContainer>
        </InfoContainer>
        <Icon onClick={handleToggleWishlist}>
          {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </Icon>
      </Wrapper>
      <Newsletter />
      <Footer />
    </Container>
  );
};

export default Product;
*/


import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import styled from "styled-components";
import Announcement from "../Components/Announcement";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Productitem from '../Components/Product'; // Adjust the path as needed
import Newsletter from "../Components/Newsletter";
import { mobile } from "../responsive";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods";
import { addProduct } from "../redux/cartRedux";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Rating from '../Components/Rating';

const Container = styled.div`
  background-color: #f4f4f4; // Light background for contrast
  //margin-top: 60px;
`;

const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px; // Add space between image and info
  ${mobile({ padding: "10px", flexDirection: "column" })}
`;

const ImgContainer = styled.div`
  flex: 1;
  border-radius: 10px; // Rounded corners for image container
  overflow: hidden; // Ensure child elements respect border-radius
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); // Add subtle shadow
`;

const Image = styled.img`
  width: 100%;
  height: 90vh;
  object-fit: cover;
  transition: transform 0.3s; // Smooth zoom effect on hover
  &:hover {
    transform: scale(1.05); // Slight zoom on hover
  }
  ${mobile({ height: "40vh" })}
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 20px 50px;
  background-color: white; // White background for info section
  border-radius: 10px; // Rounded corners
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); // Add subtle shadow
  // margin-left: 20px; // Optional: Uncomment for specific left margin
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300; // Lighten title font weight
  font-size: 2.5rem; // Increase title size
  color: #333; // Darker color for contrast
`;

const Desc = styled.p`
  margin: 20px 0px;
  line-height: 1.6; // Improve readability
  color: #555; // Softer text color
`;

const Price = styled.span`
  font-weight: 500; // Bold price
  font-size: 2rem; // Increase price size
  color: #1d8b7e; // Use a contrasting color for price
`;

const FilterContainer = styled.div`
  width: 100%;
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
`;

const FilterTitle = styled.span`
  font-size: 1.2rem; // Slightly larger filter title
  font-weight: 400; // Adjust weight for balance
  color: #333; // Darker color for better visibility
`;

const FilterColor = styled.div`
  width: 25px; // Slightly larger color dots
  height: 25px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  margin: 0px 5px;
  cursor: pointer;
  transition: transform 0.3s; // Smooth transition on hover
  &:hover {
    transform: scale(1.1); // Slightly enlarge on hover
  }
`;

const FilterSize = styled.select`
  margin-left: 10px;
  padding: 8px; // Increase padding for better usability
  border-radius: 5px; // Rounded corners
  border: 1px solid #ccc; // Subtle border
  cursor: pointer; // Change cursor on hover
`;

const FilterSizeOption = styled.option``;

const AddContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const Amount = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
  font-size: 1.2rem; // Increase amount size for visibility
`;

const Button = styled.button`
  padding: 15px;
  border: 2px solid teal;
  background-color: white;
  cursor: pointer;
  font-weight: 500;
  border-radius: 5px; // Rounded corners
  transition: background-color 0.3s, transform 0.3s; // Smooth transitions

  &:hover {
    background-color: #f8f4f4;
    transform: scale(1.05); // Scale up on hover
  }
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); // Shadow for the icon
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;
const TitleS = styled.h1`
  margin: 20px;
  padding: 25px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
`;

const Product = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  console.log("prod id",id)
  const user = useSelector((state) => state.user.currentUser);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const handleRatingChange = async (newRating) => {
    if (!user) {
      alert("Please log in to rate this product.");
      return; // Exit the function if user is not logged in
    }
    
    setUserRating(newRating);
    try {
      const res = await axios.put(`http://localhost:5000/api/products/${id}/rate`, {
        rating: newRating,
        userId: user._id
      });
      setProduct(res.data);
    } catch (error) {
      console.error('Failed to submit rating', error);
    }
  };

  useEffect(() => {
    if (user) {
      const checkWishlist = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/wishlist/find/${user._id}`, {
            headers: { token: `Bearer ${user.accessToken}` },
          });
          const productInWishlist = res.data.products.some(
            (product) => product.productId === id
          );
          setIsInWishlist(productInWishlist);
        } catch (err) {
          console.error("Failed to check wishlist", err);
        }
      };
      checkWishlist();
    }
  }, [user, id]);

  useEffect(() => {
    const getProduct = async () => {
        setLoading(true);
        try {
            const res = await publicRequest.get("/products/find/" + id);
            setProduct(res.data);
            console.log(res.data)
            console.log(res.data.categories)
            // Fetch suggested products
            const suggestedRes = await publicRequest.get(`/products/${id}/suggested`); // Modify endpoint as needed
            setSuggestedProducts(suggestedRes.data);
            console.log(suggestedRes)
            // Check if user has already rated this product
            if (user) {
              const userRatingObj = res.data.ratings.find(r => r.userId === user._id);
              if (userRatingObj) {
                setUserRating(userRatingObj.rating); // Set the user's rating
              }
            }
        } catch (error) {
            setError("Failed to load product. Please try again later.");
            console.error("Error fetching product:", error);
        } finally {
            setLoading(false);
        }
    };
    getProduct();
  }, [id, user]);

  /*useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      try {
        const res = await publicRequest.get("/products/find/" + id);
        setProduct(res.data);
        const userRatingObj = res.data.ratings.find(r => r.userId === user._id);
        if (userRatingObj) {
          setUserRating(userRatingObj.rating);
        }
      } catch (error) {
        setError("Failed to load product. Please try again later.");
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id, user._id]);*/

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <LoadingContainer>
        <Alert severity="error">{error}</Alert>
      </LoadingContainer>
    );
  }

  const handleToggleWishlist = async () => {
    if (!user) {
      alert("Please log in to manage your wishlist.");
      return;
    }

    try {
      if (isInWishlist) {
        await axios.delete(`http://localhost:5000/api/wishlist/${user._id}/product/${id}`, {
          headers: { token: `Bearer ${user.accessToken}` },
        });
      } else {
        await axios.post(`http://localhost:5000/api/wishlist/${user._id}`, {
          productId: id,
        }, {
          headers: { token: `Bearer ${user.accessToken}` },
        });
      }
      setIsInWishlist(!isInWishlist);
    } catch (err) {
      console.error("Failed to update wishlist", err);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "dec") {
      quantity > 1 && setQuantity(quantity - 1);
    } else {
      if(quantity < product.inStock)
        setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    dispatch(addProduct({ ...product, quantity, color, size }));
  };

  const isAnnouncementVisible = true;
  return (
    <Container>
    {isAnnouncementVisible && <Announcement />} {/* Render Announcement based on the variable */}
    <Navbar showNavbar={isAnnouncementVisible} hasAnnouncement={isAnnouncementVisible}/>
      <Wrapper>
        <ImgContainer>
          <Image src={product.img} />
        </ImgContainer>
        <InfoContainer>
          <Title>{product.title}</Title>
          <Desc>{product.desc}</Desc>
          <Price>${product.price}</Price>
          <FilterContainer>
            <Filter>
              <FilterTitle>Color</FilterTitle>
              {product.color?.map((c) => (
                <FilterColor key={c} color={c} onClick={() => setColor(c)} />
              ))}
            </Filter>
            <Filter>
              <FilterTitle>Size</FilterTitle>
              <FilterSize onChange={(e) => setSize(e.target.value)}>
                {product.size?.map((s) => (
                  <FilterSizeOption key={s}>{s}</FilterSizeOption>
                ))}
              </FilterSize>
            </Filter>
          </FilterContainer>
          <AddContainer>
            <AmountContainer>
              <Remove onClick={() => handleQuantityChange("dec")} />
              <Amount>{quantity}</Amount>
              <Add onClick={() => handleQuantityChange("inc")} />
            </AmountContainer>
            <Button onClick={handleAddToCart}>ADD TO CART</Button>
            <Icon onClick={handleToggleWishlist}>
              {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </Icon>
          </AddContainer>
          <Rating rating={userRating} onRatingChange={handleRatingChange} />
          <span>{product.averageRating.toFixed(1)} ({product.ratingCount})</span>

        </InfoContainer>
      </Wrapper>
      <TitleS>Suggested Products :</TitleS>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {suggestedProducts.map((suggestedProduct) => (
            <Productitem key={suggestedProduct._id} item={suggestedProduct} />
          ))}
        </div>
      <Newsletter />
      <Footer />
    </Container>
  );
};

export default Product;
