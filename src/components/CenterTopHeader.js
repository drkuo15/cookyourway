import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logoImage from '../images/CookYourWay_logo_v1.png';

const CenterHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: calc(50*100vw/1920);
  margin: calc(56*100vw/1920) 0 calc(48*100vw/1920) 0;
`;

const ImgLink = styled(Link)`
  width: calc(124*100vw/1920);
  height: calc(124*100vw/1920);
`;

const Img = styled.img`
  width: calc(124*100vw/1920);
  height: calc(124*100vw/1920);
`;

const Title = styled.div`
  color: #EB811F;
  font-size: calc(76*100vw/1920);
`;

function CenterTopHeader() {
  return (
    <CenterHeader>
      <ImgLink to="/">
        <Img src={logoImage} alt="logoImage" />
      </ImgLink>
      <Title>Cook Your Way</Title>
    </CenterHeader>
  );
}

export default CenterTopHeader;
