import styled from 'styled-components'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useEffect, useState } from 'react';
import { sliderItems } from "../slider";
import { mobile } from "../responsive";
import { Link } from "react-router-dom";
const Container=styled.div`
/*width: 100%;
height: 100vh;
display: flex;
position: relative;
top: 30px;
overflow: hidden;*/
width: 100%;
  height: 100vh;
  display: flex;
  position: relative;
  top: 28px;
  margin-bottom: 10px;
  overflow: hidden;
  ${mobile({ display: "none" })}
`
const Arrow = styled.div`
  width: 50px;
  height: 50px;
  background-color: #fff7f7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(props) => props.direction === "left" && "10px"};
  right: ${(props) => props.direction === "right" && "10px"};
  margin: auto;
  cursor: pointer;
  opacity: 0.5;
  z-index: 2;
`;
const Wraper=styled.div`
height: 100%;
display: flex;
transition: all 1.5s ease;
transform: translateX(${(props) => props.slideIndex * -100}vw);
`

const Slide=styled.div`
width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: #${(props) => props.bg};
`;
const Imgcontainer=styled.div`
height: 100%;
flex: 1;
`;
const Image=styled.img`
height:100%;
width:100%;
//height: 80%;
`;
const Info=styled.div`
flex: 1;
padding:50px; /* Add padding to give space around the text */
`;

const Title=styled.h1`
font-size:70px;

`;
const Desc=styled.p`
margin: 50px 0px;
font-size: 20px;
font-weight: 500;
letter-spacing: 3px;
`;
const Button=styled.button`
padding: 10px;
font-size: 20px;
background-color: transparent;
cursor: pointer;
`;
const LinkItem=styled(Link)`
  text-decoration: none;
  color: inherit;
`
const Slider = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const handleClick = (direction) => {
        if (direction === "left") {
        setSlideIndex(slideIndex > 0 ? slideIndex - 1 : 2);
        } else {
        setSlideIndex(slideIndex < 2 ? slideIndex + 1 : 0);
        }
    };
    useEffect(() => {
      const interval = setInterval(() => {
        setSlideIndex((prev) => (prev < 2 ? prev + 1 : 0));
      }, 3000); // Change slides every 3 seconds
    
      return () => clearInterval(interval); // Clean up the interval on unmount
    }, []);

    return (
    <Container>
        <Arrow direction="left" onClick={()=>handleClick("left")}>
           <NavigateBeforeIcon/>
        </Arrow>
        <Wraper slideIndex={slideIndex}>
            {sliderItems.map((item) => (
            <Slide bg={item.bg} key={item.id}>
                <Imgcontainer>
                <Image src={item.img} />
                </Imgcontainer>
                <Info>
                <Title>{item.title}</Title>
                <Desc>{item.desc}</Desc>
                <LinkItem to={`/products/${item.cat}`}>
                    <Button>SHOW NOW</Button>
                </LinkItem>
                </Info>
            </Slide>
            ))}
        </Wraper>
        <Arrow direction="right" onClick={()=>handleClick("right")}>
            <NavigateNextIcon/>
        </Arrow>
    </Container>
)
}

    export default Slider