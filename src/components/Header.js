import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logoImage from '../images/CookYourWay_logo_v1.png';

const Background = styled.div`
  width: 100vw;
  height: calc(116*100vw/1920);
  background-color: #E5D2C080;
  display: flex;
  align-item: center;
  justify-content: space-between;
  padding: calc(26*100vw/1920);
  position: fixed;
  top: 0;
`;

const LeftDiv = styled.div`
  gap: calc(26*100vw/1920);
  display: flex;
  align-items: center;
`;

const RightDiv = styled(LeftDiv)`
  gap: calc(20*100vw/1920);
`;

const ImgLink = styled(Link)`
  width: calc(64*100vw/1920);
  height: calc(64*100vw/1920);
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Img = styled.img`
  width: calc(64*100vw/1920);
  height: calc(64*100vw/1920);
`;

const Title = styled.div`
  width: calc(450*100vw/1920);
  height: calc(64*100vw/1920);
  color: #EB811F;
  font-size: calc(48*100vw/1920);
`;

const DropBtn = styled.button`
  width: calc(200*100vw/1920);
  height: calc(64*100vw/1920);
  background-color: #FDFDFC;
  cursor: pointer;
  border-radius: calc(15*100vw/1920);
  font-size: calc(28*100vw/1920);
  color: #2B2A29;
  border: calc(3*100vw/1920)  #2B2A29 solid;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {background-color: #584743; color: #FDFDFC;}
`;

const Padding = styled.div`
  height: calc(116*100vw/1920);
`;

function Header() {
  return (
    <>
      <Background>
        <LeftDiv>
          <ImgLink to="/">
            <Img src={logoImage} alt="logoImage" />
          </ImgLink>
          <Title>Cook Your Way</Title>
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
