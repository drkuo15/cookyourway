import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { devices } from '../utils/StyleUtils';
import logoImage from '../images/CookYourWay_logo_v1.png';

const Background = styled.div`
  width: 100vw;
  height: calc(116*100vw/1920);
  background-color: #E5D2C0;
  display: flex;
  align-item: center;
  justify-content: space-between;
  padding: calc(26*100vw/1920);
  position: fixed;
  top: 0;
  z-index: 200;
  box-shadow: 0px 0px calc(30*100vw/1920) #fdfdfc;
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(320*100vw/1920);
  }
`;

const LeftDiv = styled.div`
  gap: calc(26*100vw/1920);
  display: flex;
  align-items: center;
  @media ${devices.Tablet} and (orientation:portrait) {
    gap: calc(60*100vw/1920);
  }
`;

const RightDiv = styled(LeftDiv)`
  gap: calc(20*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    gap: calc(50*100vw/1920);
  }
`;

const ImgLink = styled(Link)`
  width: calc(64*100vw/1920);
  height: calc(64*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(180*100vw/1920);
    height: calc(180*100vw/1920);
  }
`;

const TitleLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Img = styled.img`
  width: calc(64*100vw/1920);
  height: calc(64*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(180*100vw/1920);
    height: calc(180*100vw/1920);
  }
`;

const Title = styled.div`
  width: calc(450*100vw/1920);
  height: calc(64*100vw/1920);
  color: #EB811F;
  font-size: calc(48*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1000*100vw/1920);
    height: calc(180*100vw/1920);
    font-size: calc(120*100vw/1920);
    padding-top: calc(20*100vw/1920);
  }
`;

const DropBtn = styled.button`
  width: calc(150*100vw/1920);
  height: calc(64*100vw/1920);
  background-color: transparent;
  cursor: pointer;
  border-radius: calc(15*100vw/1920);
  font-size: calc(28*100vw/1920);
  font-weight: 500;
  color: #2B2A29;
  border: 0;
  border-bottom: calc(5*100vw/1920) #EB811F solid;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover { 
    box-shadow: 0 2px 2px -2px #EB811F ;
    color: #000000;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(200*100vw/1920);
    height: calc(150*100vw/1920);
    font-size: calc(70*100vw/1920);
  }
`;

const Padding = styled.div`
  height: calc(116*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(320*100vw/1920);
  }
`;

function Header() {
  return (
    <>
      <Background>
        <LeftDiv>
          <ImgLink to="/">
            <Img src={logoImage} alt="logoImage" />
          </ImgLink>
          <TitleLink to="/"><Title>Cook Your Way</Title></TitleLink>
        </LeftDiv>
        <RightDiv>
          <StyledLink to="/login">
            <DropBtn>登入</DropBtn>
          </StyledLink>
        </RightDiv>
      </Background>
      <Padding />
    </>
  );
}

export default Header;
