import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { userRequest } from "../requestMethods.js";
import { Link } from "react-router-dom";
import styled from "styled-components";
//import { addNotification } from "../../../admin/src/redux/userRedux.js";

const LinkItem = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
`;

const Message = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const OrderNumber = styled.span`
  font-weight: bold;
  color: #2e8b57;
`;

const Button = styled.button`
  padding: 12px 24px;
  margin-top: 20px;
  background-color: #2e8b57;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3ea26d;
  }
`;

const Success = () => {
  const location = useLocation();
  const { cart, formData, userId } = location.state;
  const currentUser = useSelector((state) => state.user.currentUser);
  const [orderId, setOrderId] = useState(null);
  const dispatch=useDispatch();
  useEffect(() => {
    const createOrder = async () => {
      try {
        const res = await userRequest.post(
          "/orders",
          {
            userId: currentUser._id,
            products: cart.products.map((item) => ({
              productId: item._id,
              quantity: item.quantity,
            })),
            amount: cart.total,
            address: formData.address,
            status: "pending",
          },
          {
            headers: { token: `Bearer ${currentUser.accessToken}` },
          }
        );
        setOrderId(res.data._id);
        //dispatch(addNotification({ message: `${currentUser._id} has ordered ${cart.total} !!`, type: "success" }));
        for (const item of cart.products) {
          await userRequest.put(
            `/products/${item._id}`,
            { inStock: item.inStock - item.quantity }, // Subtract the purchased quantity from inStock
            {
              headers: { token: `Bearer ${currentUser.accessToken}` },
            }
          );
          
        //dispatch(addNotification({ message: `Product ${item.title} is updated !!`, type: "success" }));
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized error: Token might be invalid or missing");
        } else {
          console.error("Error:", error.response ? error.response.data : error.message);
        }
      }
    };
    createOrder();
  }, [cart, formData, currentUser]);

  return (
    <Container>
      <Message>
        {orderId ? (
          <>
            Order has been created successfully! <br />
            Your order number is <OrderNumber>{orderId}</OrderNumber>.
          </>
        ) : (
          <>Successfully placed your order! Your order is being prepared...</>
        )}
      </Message>
      <LinkItem to="/">
        <Button>Go to Homepage</Button>
      </LinkItem>
    </Container>
  );
};

export default Success;
